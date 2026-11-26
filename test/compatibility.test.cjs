const assert = require('node:assert/strict');
const { registerHooks } = require('node:module');
const { test } = require('node:test');
const manifest = require('../package.json');

const settings = new Map();
class TextPart {
	constructor(value) {
		this.value = value;
	}
}
class DataPart {
	constructor(data, mimeType) {
		this.data = data;
		this.mimeType = mimeType;
	}
	static json(value, mimeType) {
		return new DataPart(value, mimeType);
	}
}
class ToolCallPart {
	constructor(callId, name, input) {
		Object.assign(this, { callId, name, input });
	}
}
class ToolResultPart {
	constructor(callId, content) {
		Object.assign(this, { callId, content });
	}
}
const vscode = {
	LanguageModelTextPart: TextPart,
	LanguageModelThinkingPart: class extends TextPart {},
	LanguageModelDataPart: DataPart,
	LanguageModelToolCallPart: ToolCallPart,
	LanguageModelToolResultPart: ToolResultPart,
	LanguageModelChatMessageRole: { User: 1, Assistant: 2 },
	EventEmitter: class {
		event() {}
	},
	window: { createOutputChannel: () => ({ appendLine() {} }) },
	workspace: {
		onDidChangeConfiguration() {},
		getConfiguration: () => ({ get: (key, fallback) => settings.get(key) ?? fallback }),
	},
};

const mockUrl = 'file:///mock-vscode-runtime.cjs';
globalThis.mockVscode = vscode;
const hooks = registerHooks({
	resolve(specifier, context, nextResolve) {
		return specifier === 'vscode'
			? { url: mockUrl, shortCircuit: true }
			: nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		return url === mockUrl
			? {
					format: 'commonjs',
					source: 'module.exports = globalThis.mockVscode;',
					shortCircuit: true,
				}
			: nextLoad(url, context);
	},
});
const { MiMoChatProvider } = require('../out/provider');
const { getApiModelId, getMaxTokens } = require('../out/config');
hooks.deregister();
delete globalThis.mockVscode;

const pro = 'mimo-v2.6-pro';
const flash = 'mimo-v2.6-flash';

test('model overrides prefer new keys and preserve custom legacy aliases', () => {
	settings.set('modelIdOverrides', {
		'mimo-v2.5-pro': 'mimo-v2.5-pro',
		'mimo-v2.5': 'proxy-flash',
	});
	assert.equal(getApiModelId(pro), pro);
	assert.equal(getApiModelId(flash), 'proxy-flash');
	settings.set('modelIdOverrides', { 'mimo-v2.5': 'proxy-old', [flash]: ' proxy-new ' });
	assert.equal(getApiModelId(flash), 'proxy-new');
	settings.delete('modelIdOverrides');
});

test('optional output limit is a positive integer, capped at 128 Ki', () => {
	for (const [value, expected] of [
		[0, undefined],
		[0.5, undefined],
		[900.5, 900],
		[999999, 131072],
	]) {
		settings.set('maxTokens', value);
		assert.equal(getMaxTokens(), expected);
	}
	settings.delete('maxTokens');
});

test('provider streams text, includes images, and replays reasoning for tools', async (t) => {
	const requests = [];
	t.mock.method(globalThis, 'fetch', async (url, options) => {
		assert.equal(url, 'https://api.xiaomimimo.com/v1/chat/completions');
		const request = JSON.parse(options.body);
		requests.push(request);
		const chunks = request.messages.some((m) => m.role === 'tool')
			? [{ delta: { content: 'Fixture complete.' }, finish_reason: 'stop' }]
			: request.tools
				? [
						{ delta: { reasoning_content: 'tool reasoning' } },
						{
							delta: {
								tool_calls: [
									{ index: 0, id: 'call_fixture', function: { name: 'fixture', arguments: '{' } },
								],
							},
						},
						{
							delta: { tool_calls: [{ index: 0, function: { arguments: '}' } }] },
							finish_reason: 'tool_calls',
						},
					]
				: [{ delta: { content: 'Hello.' }, finish_reason: 'stop' }];
		return new Response(
			chunks.map((choice) => `data: ${JSON.stringify({ choices: [choice] })}\n\n`).join('') +
				'data: [DONE]\n\n',
		);
	});
	const provider = new MiMoChatProvider({
		subscriptions: [],
		secrets: {
			async get() {
				return 'fixture-key';
			},
			onDidChange() {},
		},
	});
	const models = await provider.provideLanguageModelChatInformation({}, {});
	assert.deepEqual(
		models.map((m) => m.id),
		[pro, flash],
	);
	const overrideSchema =
		manifest.contributes.configuration.properties['mimo-copilot.modelIdOverrides'];
	for (const model of models) {
		assert.equal(model.capabilities.imageInput, true);
		assert.equal(model.capabilities.toolCalling, true);
		assert.ok(overrideSchema.properties[model.id]);
	}
	const token = { onCancellationRequested: () => ({ dispose() {} }) };
	async function complete(model, messages, options = {}) {
		const parts = [];
		await provider.provideLanguageModelChatResponse(
			model,
			messages,
			options,
			{ report: (part) => parts.push(part) },
			token,
		);
		return parts;
	}
	for (const model of models) {
		const user = {
			role: 1,
			content: [
				new TextPart('Describe this image'),
				new DataPart(Uint8Array.from([1, 2, 3]), 'image/png'),
			],
		};
		const parts = await complete(model, [user]);
		assert.equal(parts[0].value, 'Hello.');
		const request = requests.at(-1);
		assert.equal(request.model, model.id);
		assert.equal(request.messages[0].content[1].image_url.url, 'data:image/png;base64,AQID');
		assert.equal('max_completion_tokens' in request, false);
	}
	const user = { role: 1, content: [new TextPart('Use the fixture tool.')] };
	const options = { tools: [{ name: 'fixture', inputSchema: { type: 'object' } }] };
	settings.set('maxTokens', 2048);
	t.after(() => settings.delete('maxTokens'));
	const first = await complete(models[0], [user], options);
	assert.equal(first[0].value, 'tool reasoning');
	assert.deepEqual(first[1], new ToolCallPart('call_fixture', 'fixture', {}));
	assert.equal(requests.at(-1).max_completion_tokens, 2048);
	assert.equal('max_tokens' in requests.at(-1), false);
	const assistant = { role: 2, content: [first[1]] };
	const result = { role: 1, content: [new ToolResultPart('call_fixture', [new TextPart('ok')])] };
	const second = await complete(models[0], [assistant, result], options);
	assert.equal(second[0].value, 'Fixture complete.');
	assert.equal(requests.at(-1).messages[0].reasoning_content, 'tool reasoning');
	assert.equal(requests.at(-1).messages[1].tool_call_id, 'call_fixture');
});
