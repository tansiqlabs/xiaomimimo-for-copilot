<h1 align="center">Xiaomi MiMo for GitHub Copilot Chat</h1>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=tansiqlabs.tansiqlabs-xiaomimimo-for-copilot"><img src="https://img.shields.io/badge/VS%20Code-Install%20Extension-blue?logo=visualstudiocode&style=for-the-badge" alt="Install in VS Code"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=tansiqlabs.tansiqlabs-xiaomimimo-for-copilot"><img src="https://vsmarketplacebadges.dev/version-short/tansiqlabs.tansiqlabs-xiaomimimo-for-copilot.svg?style=for-the-badge" alt="Version"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=tansiqlabs.tansiqlabs-xiaomimimo-for-copilot"><img src="https://vsmarketplacebadges.dev/installs-short/tansiqlabs.tansiqlabs-xiaomimimo-for-copilot.svg?style=for-the-badge" alt="Installs"></a>
</p>

**Pick MiMo V2.6 Pro and V2.6 Flash from the Copilot Chat model picker — with thinking mode, vision, and agent tools.**

Love Xiaomi MiMo's reasoning capabilities but don't want to leave Copilot Chat? This extension drops **MiMo V2.6 Pro and V2.6 Flash** straight into the model selector — with **thinking mode**, **image input**, **tool calling**, and your own API key.

## Why this extension?

- **Don't replace Copilot — power it up.** No new sidebar, no new chat UI to learn. Just new models in the picker you already use.
- **Agent mode, tool calling, instructions, MCP, skills — all of it still works.** Copilot's entire stack, now running on MiMo.
- **Prompt cache statistics.** See cache hits in the MiMo output channel when the API reports them.
- **Reasoning token tracking.** The output channel logs reasoning token counts when reported by the API so you can see how much thinking the model invested.
- **Both models accept images.** Attach screenshots, UI mockups, or diagrams to Copilot Chat.
- **MiMo V2.6 Pro excels at deep reasoning.** Complex refactors, multi-step debugging, algorithm design — tasks that need serious thinking.
- **BYOK, pay MiMo directly.** Your API key, your bill, your rate limits. Stored in the OS keychain, never on disk.

## Features

### MiMo V2.6 Pro and V2.6 Flash in the model picker
Both models show up alongside GPT-4o, Claude, and friends in Copilot Chat's model selector. 1M-token total context on both. Switch models mid-chat without losing history.

### Prompt cache statistics
The extension logs cached-token counts from Xiaomi's streaming usage reports. Cache behavior is managed by the API.

### Thinking Mode with Reasoning Token Visibility
Full support for MiMo's `reasoning_content`. Watch the model's thought process in real-time as it tackles complex problems. When the API includes usage details, the output channel shows the reported **reasoning token** count — so you know how much "thinking" each answer cost you.

### Image input
Attach a screenshot or UI mockup with Pro or Flash. The Copilot integration passes through images, not audio or video.

### Inherits Every Copilot Capability
Because this plugs into Copilot's native provider API, you get the full stack for free:
- **Agent mode** — autonomous multi-step tasks
- **Tool calling** — file edits, terminal, workspace search, Git, tests
- **Instructions & skills** — all your `.instructions.md`, `AGENTS.md`, and skills just work
- **Prompt caching stats** — MiMo's cache hit rate logged in the output channel so you can see the savings

### Multi-Region API Support
Choose the API endpoint that matches your subscription plan:
- Default API (no plan)
- Token Plan — China
- Token Plan — Singapore
- Token Plan — Europe (Amsterdam)

### Secure by Default
API key lives in VS Code's `SecretStorage` (OS keychain on macOS / Windows / Linux). Never in `settings.json`, never in your Git history.

### Zero Runtime Dependencies
Pure VS Code API + Node.js built-ins. No Python, no Docker, no local proxy server to babysit.

## Getting Started

### Prerequisites

- VS Code 1.120 or later. This extension relies on non-public Copilot Chat APIs that may break on newer VS Code versions — [report an issue](https://github.com/tansiqlabs/xiaomimimo-for-copilot/issues) if you hit one.
- GitHub Copilot subscription (Free / Pro / Enterprise — the free tier works)
- MiMo API key from [platform.xiaomimimo.com](https://platform.xiaomimimo.com/console/api-keys)

### Usage

1. Install from the VS Code Marketplace
2. Run **MiMo: Set API Key** from the Command Palette (`Ctrl+Shift+P`)
3. Paste your API key
4. Open Copilot Chat, click the model picker, pick **MiMo V2.6 Pro** or **MiMo V2.6 Flash**
5. That's it — chat away

## Models

| Model | Best For | Vision |
|---|---|---|
| **MiMo V2.6 Pro** | Complex refactors, agent tasks, deep reasoning, algorithm design | ✅ |
| **MiMo V2.6 Flash** | Fast everyday coding, quick edits, image analysis, UI understanding | ✅ |

Both support thinking mode, tool calling, and 1M-token total context.

## Upgrading from V2.5

Xiaomi retired the V2.5 chat API IDs. Reselect **MiMo V2.6 Pro** or **MiMo V2.6 Flash** in Copilot Chat after upgrading. Your saved API key and region are unchanged. If you use a compatible third-party endpoint, move custom override keys from `mimo-v2.5-pro` to `mimo-v2.6-pro`, and from `mimo-v2.5` to `mimo-v2.6-flash`. The old keys still work for custom values unless the corresponding new key is set.

## Settings

| Setting | Default | Description |
|---|---|---|
| `mimo-copilot.baseUrl` | `https://api.xiaomimimo.com/v1` | API endpoint — select a preset or enter a custom URL |
| `mimo-copilot.maxTokens` | `0` | Max output tokens (`0` = API default; positive values capped at 131072). Useful for cost control |
| `mimo-copilot.modelIdOverrides` | `{}` | Override API model IDs — only needed for compatible third-party APIs |

## Commands

| Command | Description |
|---|---|
| `MiMo: Set API Key` | Configure your MiMo API key |
| `MiMo: Get API Key` | Open the MiMo platform to get an API key |
| `MiMo: Clear API Key` | Remove the stored API key |
| `MiMo: Open Settings` | Open MiMo extension settings |
| `MiMo: Show Logs` | View extension logs for debugging |

## Support

- Website: [tansiqlabs.com](https://tansiqlabs.com)
- Email: support@tansiqlabs.com
- Issues: [GitHub Issues](https://github.com/tansiqlabs/xiaomimimo-for-copilot/issues)

## License

[MIT](LICENSE)
