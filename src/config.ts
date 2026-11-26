import vscode from 'vscode';
import { CONFIG_SECTION } from './consts';

/**
 * Get MiMo API base URL from settings.
 * Falls back to the official endpoint when not configured.
 */
export function getBaseUrl(): string {
	const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
	return config.get<string>('baseUrl') || 'https://api.xiaomimimo.com/v1';
}

const LEGACY_MODEL_IDS: Readonly<Record<string, string>> = {
	'mimo-v2.6-pro': 'mimo-v2.5-pro',
	'mimo-v2.6-flash': 'mimo-v2.5',
};

/**
 * Resolve the API model ID to send to the endpoint.
 *
 * Users can override model IDs via the `modelIdOverrides` setting object
 * (e.g. for third-party API proxies). Preserve legacy custom overrides,
 * but do not route new models to retired official IDs.
 */
export function getApiModelId(vscodeModelId: string): string {
	const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const overrides = config.get<Record<string, string>>('modelIdOverrides');
	const override = overrides?.[vscodeModelId]?.trim();
	if (override) {
		return override;
	}

	const legacyId = LEGACY_MODEL_IDS[vscodeModelId];
	const legacyOverride = legacyId ? overrides?.[legacyId]?.trim() : undefined;
	return legacyOverride && legacyOverride !== legacyId ? legacyOverride : vscodeModelId;
}

/**
 * Get the configured max output tokens limit.
 * Returns `undefined` when set to 0 (use the API default).
 */
export function getMaxTokens(): number | undefined {
	const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const value = config.get<number>('maxTokens', 0);
	return Number.isFinite(value) && value >= 1 ? Math.min(Math.floor(value), 131072) : undefined;
}
