// AI 解读 — 支持 DeepSeek / Claude 双 Provider
// 优先级：DEEPSEEK_API_KEY > ANTHROPIC_API_KEY
import type { ReadingRequest } from './prompts';
import { buildReadingPrompt } from './prompts';

// ---- 配置 ----
const AI_PROVIDER = process.env.AI_PROVIDER || 'deepseek'; // 'deepseek' | 'anthropic'

const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const ANTHROPIC_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

/** 检测可用的 Provider */
function getProvider(): 'deepseek' | 'anthropic' {
  if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return AI_PROVIDER as 'deepseek' | 'anthropic';
}

// ---- 流式生成 ----

/** DeepSeek 流式（OpenAI 兼容格式） */
async function deepseekStream(req: ReadingRequest) {
  const OpenAI = (await import('openai')).default;
  const { systemPrompt, userPrompt } = buildReadingPrompt(req);

  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || 'sk-placeholder',
    baseURL: 'https://api.deepseek.com',
  });

  return client.chat.completions.create({
    model: DEEPSEEK_MODEL,
    temperature: 0.7,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    stream: true,
  });
}

/** Anthropic 流式 */
async function anthropicStream(req: ReadingRequest) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const { systemPrompt, userPrompt } = buildReadingPrompt(req);

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'sk-placeholder',
  });

  return client.messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.7,
  });
}

/**
 * 统一流式接口
 * 返回一个 AsyncIterable，每次 yield { text: string }
 * 调用方不需要关心底层是 DeepSeek 还是 Claude
 */
export async function* generateReadingStream(req: ReadingRequest): AsyncGenerator<{ text: string }> {
  const provider = getProvider();

  if (provider === 'deepseek') {
    const stream = await deepseekStream(req);
    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content;
      if (text) yield { text };
    }
  } else {
    const stream = await anthropicStream(req);
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && 'text' in event.delta) {
        yield { text: event.delta.text };
      }
    }
  }
}

// ---- 非流式生成 ----

export async function generateReading(req: ReadingRequest): Promise<string> {
  const provider = getProvider();
  const { systemPrompt, userPrompt } = buildReadingPrompt(req);

  if (provider === 'deepseek') {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || 'sk-placeholder',
      baseURL: 'https://api.deepseek.com',
    });

    const response = await client.chat.completions.create({
      model: DEEPSEEK_MODEL,
      temperature: 0.7,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    return response.choices[0]?.message?.content || '';
  }

  // Anthropic
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'sk-placeholder',
  });

  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.7,
  });

  const texts: string[] = [];
  for (const block of response.content) {
    if (block.type === 'text') texts.push(block.text);
  }
  return texts.join('\n');
}
