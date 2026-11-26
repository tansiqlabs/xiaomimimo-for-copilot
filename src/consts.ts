import type { ModelDefinition } from './types';

/**
 * Compile-time constants shared across the extension.
 *
 * These do NOT depend on the VS Code runtime (no workspace configuration,
 * no secrets API). For run-time settings reads see `config.ts`.
 */

/** VS Code configuration section prefix for all extension settings. */
export const CONFIG_SECTION = 'mimo-copilot';

// ---- Secret keys ----

/** SecretStorage key for the MiMo API key. */
export const API_KEY_SECRET = 'mimo-copilot.apiKey';

/** memento key tracking whether the welcome walkthrough has been shown. */
export const WELCOME_SHOWN_KEY = 'mimo-copilot.welcomeShown';

// ---- Walkthrough ----

/** Walkthrough contribution ID. */
export const WALKTHROUGH_ID = 'tansiqlabs.xiaomimimo-for-copilot#mimoGettingStarted';

// ---- Model picker ----

/** Detail text shown in the model picker when no API key is configured. */
export const API_KEY_REQUIRED_DETAIL = 'Please run MiMo: Set API Key to configure.';

// ---- Cache ----

/** Max entries in the reasoning-content cache before eviction kicks in. */
export const MAX_CACHE_SIZE = 200;

// ---- Model registry ----

/** Available MiMo models exposed through the language model provider. */
// Reserve the 128 Ki output budget within the 1 Mi token context.
export const MODELS: ModelDefinition[] = [
	{
		id: 'mimo-v2.6-pro',
		name: 'MiMo V2.6 Pro',
		family: 'mimo',
		version: 'v2.6',
		detail: 'Most capable reasoning model with vision',
		maxInputTokens: 917504,
		maxOutputTokens: 131072,
		capabilities: {
			toolCalling: true,
			imageInput: true,
			thinking: true,
		},
		requiresThinkingParam: false,
	},
	{
		id: 'mimo-v2.6-flash',
		name: 'MiMo V2.6 Flash',
		family: 'mimo',
		version: 'v2.6',
		detail: 'Fast model with vision support',
		maxInputTokens: 917504,
		maxOutputTokens: 131072,
		capabilities: {
			toolCalling: true,
			imageInput: true,
			thinking: true,
		},
		requiresThinkingParam: false,
	},
];
