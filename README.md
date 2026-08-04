# @pipeworx/deepl

[DeepL API](https://developers.deepl.com/docs) MCP — high-quality machine translation. Free tier 500k chars/mo.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_DEEPL_KEY`. BYO: `?_apiKey=…`.
- Free-tier keys end with `:fx` (auto-detected → free endpoint).

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Deepl data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
