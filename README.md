# @pipeworx/deepl

[DeepL API](https://developers.deepl.com/docs) MCP — high-quality machine translation. Free tier 500k chars/mo.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

## Auth

- Platform: `PLATFORM_DEEPL_KEY`. BYO: `?_apiKey=…`.
- Free-tier keys end with `:fx` (auto-detected → free endpoint).
- **`translate` is currently refused on the Pipeworx shared key** (HTTP 456), and it is not a
  character quota: measured 2026-08-28, `usage` on the same key answers
  `character_count: 0` against a full `character_limit` while `translate` 456s in the next
  call. Zero successes in the seven days before that. Waiting does not clear it — pass your
  own key as `_apiKey`. The read-only tools (`usage`, `source_languages`, `target_languages`,
  `glossary_language_pairs`) still answer on the shared key. Fleet #577.

## Tools

- `translate(text, target_lang, source_lang?, split_sentences?, preserve_formatting?, formality?, glossary_id?, tag_handling?, outline_detection?, non_splitting_tags?, splitting_tags?, ignore_tags?)` — translate text (one or many strings)
- `usage()` — current month's usage + limits
- `source_languages()` — supported source languages
- `target_languages()` — supported target languages
- `glossary_language_pairs()` — supported glossary language pairs

`text` accepts a string or array of strings. `target_lang`: e.g. `EN-US`, `DE`, `JA`, `ES`, `FR`. `formality`: `default | more | less | prefer_more | prefer_less`.

## Data source

`https://api.deepl.com/v2` (paid) | `https://api-free.deepl.com/v2` (free, auto-selected when key ends with `:fx`)

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "deepl": {
      "url": "https://gateway.pipeworx.io/deepl/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/deepl/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

Our deepl key is reserved for signed-up accounts (free at https://pipeworx.io), so an anonymous call to `POST https://gateway.pipeworx.io/v1/tools/deepl_translate` needs your own key passed as `_apiKey` alongside the arguments. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/deepl_translate`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "deepl": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-deepl"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-deepl
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Deepl data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
