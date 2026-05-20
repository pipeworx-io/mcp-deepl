interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * DeepL MCP.
 */


const UA = 'pipeworx-mcp-deepl/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'translate',
    description: 'Translate text (string or string[]).',
    inputSchema: {
      type: 'object',
      properties: {
        text: { description: 'String or array of strings.' },
        target_lang: { type: 'string' },
        source_lang: { type: 'string' },
        split_sentences: { type: 'string' },
        preserve_formatting: { type: 'boolean' },
        formality: { type: 'string' },
        glossary_id: { type: 'string' },
        tag_handling: { type: 'string' },
        outline_detection: { type: 'boolean' },
        non_splitting_tags: { type: 'string' },
        splitting_tags: { type: 'string' },
        ignore_tags: { type: 'string' },
      },
      required: ['text', 'target_lang'],
    },
  },
  { name: 'usage', description: "Current month's usage + limits.", inputSchema: { type: 'object', properties: {} } },
  { name: 'source_languages', description: 'Supported source languages.', inputSchema: { type: 'object', properties: {} } },
  { name: 'target_languages', description: 'Supported target languages.', inputSchema: { type: 'object', properties: {} } },
  { name: 'glossary_language_pairs', description: 'Supported glossary language pairs.', inputSchema: { type: 'object', properties: {} } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('DeepL requires an API key. Set PLATFORM_DEEPL_KEY or pass ?_apiKey=… (free at https://www.deepl.com/pro-api).');
  const base = apiKey.endsWith(':fx') ? 'https://api-free.deepl.com/v2' : 'https://api.deepl.com/v2';
  const post = async (path: string, body: Record<string, unknown>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) {
      if (v == null) continue;
      if (Array.isArray(v)) for (const item of v) p.append(k, String(item));
      else if (typeof v === 'boolean') p.set(k, v ? '1' : '0');
      else p.set(k, String(v));
    }
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA, Authorization: `DeepL-Auth-Key ${apiKey}` },
      body: p.toString(),
    });
    if (res.status === 401 || res.status === 403) throw new Error('DeepL: invalid API key.');
    if (res.status === 456) throw new Error('DeepL: 456 — translation quota exceeded.');
    if (!res.ok) throw new Error(`DeepL: ${res.status}`);
    return res.json();
  };
  const get = async (path: string) => {
    const res = await fetch(`${base}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA, Authorization: `DeepL-Auth-Key ${apiKey}` } });
    if (res.status === 401 || res.status === 403) throw new Error('DeepL: invalid API key.');
    if (!res.ok) throw new Error(`DeepL: ${res.status}`);
    return res.json();
  };
  switch (name) {
    case 'translate':
      return post('/translate', {
        text: args.text,
        target_lang: args.target_lang,
        source_lang: args.source_lang,
        split_sentences: args.split_sentences,
        preserve_formatting: args.preserve_formatting,
        formality: args.formality,
        glossary_id: args.glossary_id,
        tag_handling: args.tag_handling,
        outline_detection: args.outline_detection,
        non_splitting_tags: args.non_splitting_tags,
        splitting_tags: args.splitting_tags,
        ignore_tags: args.ignore_tags,
      });
    case 'usage':
      return get('/usage');
    case 'source_languages':
      return get('/languages?type=source');
    case 'target_languages':
      return get('/languages?type=target');
    case 'glossary_language_pairs':
      return get('/glossary-language-pairs');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
