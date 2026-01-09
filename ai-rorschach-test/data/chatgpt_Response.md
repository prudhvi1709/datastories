Claude Code (Anthropic) Integration
Anthropic’s Claude Code is a code-focused AI assistant accessible via Anthropic’s API. In principle, it runs on Anthropic’s domain (e.g. in the Claude website or CLI) and uses Anthropic’s cloud models. To embed Claude Code behind our own proxy and API key, we can use Anthropic’s API endpoints with a custom base URL. Officially, Anthropic’s documentation recognizes an environment variable ANTHROPIC_BASE_URL for setting a custom Claude API gateway
code.claude.com
. In practice, this means our web app (or extension) can ask users for a base URL (pointing to our proxy or Anthropic’s API) and an API key, then call the Claude Code API at {base_url}/v1/messages. Claude Code can be integrated in various ways. For example:
Web Frontend (JavaScript): A static or internal web page using JavaScript can call Anthropic’s /v1/messages endpoint with fetch or the @anthropic-ai/sdk library. Because Anthropic now supports CORS for browser calls, we must include the special header anthropic-dangerous-direct-browser-access: true in requests
simonw.substack.com
. This header tells Anthropic to allow client-side access (otherwise the browser would be blocked). The user would enter their Anthropic API key and our proxy’s base URL (including /v1/messages), and the script sends requests accordingly.
Internal Web App (Server-side): A Node.js or Python web app can use Anthropic’s client SDK (e.g. anthropic Python or TypeScript) and set client = new Anthropic({ apiKey, baseUrl }). The ANTHROPIC_BASE_URL environment variable (or equivalent parameter) ensures the SDK points to our proxy
code.claude.com
. The server hides keys from the browser, forwarding user prompts to Claude Code.
Browser/IDE Extension: A browser or IDE extension could prompt for base_url and API key, then invoke the Claude API under the hood. This is similar to a web frontend but packaged as an extension. It still must handle the API key and include the special CORS header to work in-browser.
All approaches rely on API proxies only (we do not host the model itself). We simply re-route calls through our proxy URL. For example, the client’s configuration would include something like:
{ "anthropic": { "base_url": "https://our.proxy.com/v1/anthropic", "api_key": "<USER_KEY>" } }
This aligns with Anthropic’s guidance: the LLM Gateway feature uses ANTHROPIC_BASE_URL to point to a gateway or proxy
code.claude.com
. Authentication & Security: Every request needs an Anthropic API key (provided by the user). Anthropic’s blog notes that exposing a key in browser code is normally unsafe
simonw.substack.com
, but the new CORS support assumes a “bring your own key” pattern for internal tools. We must warn users not to share their key and ensure our proxy does not leak it. Because the key is entered per session, the risk is limited to that user’s browser. Nonetheless, this is less secure than a fully server-side solution. Potential Issues:
CORS & Headers: Without the special header anthropic-dangerous-direct-browser-access: true, the Claude API will block browser requests. If we forget this header, we get CORS errors. We must add it to every API call from the client
simonw.substack.com
.
Proxy Compatibility: Our proxy must expose an Anthropic-compatible endpoint (e.g. /v1/messages). If using an internal gateway, it must accept the same request format. Anthropic’s docs emphasize the endpoint path must match /v1/messages
code.claude.com
.
API Limits & Latency: Claude requests go through Anthropic’s cloud (or whatever backend the proxy calls), so latency and rate limits apply as usual. We should handle any errors gracefully.
Developer Convenience: Anthropic offers a TypeScript SDK, but we may use plain fetch. Either way, we must configure the base URL (via ANTHROPIC_BASE_URL) and key before making calls.
Given these factors, integrating Claude Code via our proxies is relatively straightforward. We just treat it like any REST API: ask for base_url and api_key, then POST JSON. Anthropic’s documentation already accounts for this use-case
code.claude.com
simonw.substack.com
. The main effort is building a simple UI (form or extension) to accept user inputs and display Claude’s replies. Difficulty: ★★☆☆☆ (2/10) – Fairly Easy. Claude Code supports custom base URLs and direct browser calls (with the special CORS header)
code.claude.com
simonw.substack.com
. We only need to prompt the user for a base URL and API key, then make standard HTTP calls. Non-technical users just paste their API key and proxy URL into the interface. Security is a mild concern, but for an internal app this “bring-your-own-key” approach is acceptable
simonw.substack.com
. Overall, once configured, using Claude Code in a web interface is quite straightforward.
OpenAI Codex Integration
OpenAI’s Codex (the “codex-1” code model) can also be accessed via the OpenAI API. Unlike Claude Code, Codex is primarily a cloud-hosted agent (available in ChatGPT or via the new Codex CLI), but OpenAI has released an API-accessible model called codex-mini-latest
openai.com
. To embed Codex in our web app, we similarly use our proxy with the OpenAI API. OpenAI’s own API libraries allow overriding the base URL (for example, via OPENAI_BASE_URL) when using a proxy
github.com
. We can configure an OpenAI client with our proxy’s URL (ending in /v1/chat/completions, for instance) and the user’s API key. For Codex, we would specify model: "codex-mini-latest" in the request
openai.com
. The web interface would ask users for the base_url (our proxy endpoint) and their OpenAI key. For example, a configuration might be:
{ "openai": { "base_url": "https://our.proxy.com/v1", "api_key": "<USER_KEY>" } }
This makes the app forward user prompts to the OpenAI chat/completions API under the Codex model. Integration Approaches:
Web Frontend (JavaScript): Use fetch or the OpenAI JS SDK to call the completions endpoint. For instance, POST to ${base_url}/v1/chat/completions with headers Authorization: Bearer <API_KEY>. Since OpenAI now supports CORS on its Chat Completions endpoint
community.openai.com
, these requests can come directly from the browser. No special headers (like Anthropic’s) are needed for CORS. We do need to set the model field to a Codex model (e.g. "codex-mini-latest").
Internal App (Server-side): A Node/Python app can call OpenAI’s API normally, hiding the API key on the server. We set openai.api_base = <proxy_url> or use the OPENAI_BASE_URL env var
github.com
. The advantage is that keys are never exposed to the browser. However, since our plan is to ask users for keys, this may be less relevant.
Codex CLI / IDE: OpenAI provides a Codex CLI tool for terminal use, but it’s not a web interface. We could ignore it for this scenario.
Authentication & Security: Like Anthropic, OpenAI treats API keys as secrets. The official docs explicitly warn not to expose your API key in client-side code
platform.openai.com
. In practice, our web UI would ask for the OpenAI key and then use it in browser calls. This is only advisable in an internal, trusted app (the same “bring-your-own-key” model as Claude Code). Users must not share their API key in public code. Potential Issues:
CORS Support: Recent community reports indicate OpenAI’s chat-completions endpoint now allows CORS
community.openai.com
, so a browser fetch should work. If older endpoints or models blocked CORS, a proxy would be needed. In our case, we use the proxy’s URL, which should handle any necessary cross-origin headers.
Proxy Configuration: The proxy must accept OpenAI-format requests (/v1/chat/completions) and forward them to OpenAI’s API. We must confirm it routes calls properly. The environment variable for base URL (OPENAI_BASE_URL) should point to our proxy, similar to Anthropic’s usage
github.com
.
Model Availability: We assume codex-mini-latest is available on the proxy. If not, we may use the general ChatGPT models (e.g. gpt-4o) but that defeats using Codex. Check that the proxy’s routed backends include OpenAI’s Codex model.
Rate Limits: OpenAI enforces rate and token limits. We should handle any “429 Too Many Requests” or other errors gracefully.
Dev Experience: Implementing the UI is straightforward (just like any REST API). The main complexity is ensuring the user-provided base URL and key are correctly applied to requests. We should validate these inputs or provide defaults if organizational defaults exist.
Given these factors, embedding Codex via our proxy is slightly more complex than Claude because of OpenAI’s security stance. We must explicitly ask the user for their API key or otherwise obtain it, since OpenAI clients do not embed keys in-browser by default
platform.openai.com
. However, once the base URL and key are set, making requests to generate or review code is easy – it’s the same workflow as calling any OpenAI completion API. Difficulty: ★★★☆☆ (3/10) – Moderate. The technical steps are simple (set OPENAI_BASE_URL, provide key, call /v1/chat/completions with model: "codex-mini-latest"). OpenAI’s documentation supports custom API bases
github.com
 and recent feedback indicates CORS isn’t a blocker
community.openai.com
. The main challenge is ensuring API keys remain secret; our solution is to have each user enter their key at runtime. For non-technical users, this means pasting in a key and URL into a form. Overall it should be quite manageable once the UI is in place. Sources: Anthropic documentation mentions custom gateways via ANTHROPIC_BASE_URL
code.claude.com
 and a new CORS mode for browser access
simonw.substack.com
. OpenAI documentation warns against exposing API keys
platform.openai.com
, and community threads note CORS support for chat completions
community.openai.com
 and environment variables for proxying
github.com
.
Citations

Enterprise deployment overview - Claude Code Docs

https://code.claude.com/docs/en/third-party-integrations

Claude's API now supports CORS requests, enabling client-side applications

https://simonw.substack.com/p/claudes-api-now-supports-cors-requests

Claude's API now supports CORS requests, enabling client-side applications

https://simonw.substack.com/p/claudes-api-now-supports-cors-requests

Introducing Codex | OpenAI

https://openai.com/index/introducing-codex/

OpenAI base URL environment variable: OPENAI_API_BASE_URL vs OPENAI_BASE_URL · Issue #716 · promptfoo/promptfoo · GitHub

https://github.com/promptfoo/promptfoo/issues/716

Cross-Origin Resource Sharing (CORS) - API - OpenAI Developer Community

https://community.openai.com/t/cross-origin-resource-sharing-cors/28905

API Reference - OpenAI API

https://platform.openai.com/docs/api-reference/introduction
All Sources