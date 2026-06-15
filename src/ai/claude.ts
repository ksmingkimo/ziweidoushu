// Claude API 调用（基于 Anthropic SDK）
import Anthropic from '@anthropic-ai/sdk';
import type { ReadingRequest } from './prompts';
import { buildReadingPrompt } from './prompts';

// Claude 模型选择
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

/** 创建 Anthropic 客户端 */
function createClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }
  return new Anthropic({ apiKey });
}

/** 流式生成解读 */
export async function generateReadingStream(req: ReadingRequest) {
  const anthropic = createClient();
  const { systemPrompt, userPrompt } = buildReadingPrompt(req);

  // 使用 Vercel AI SDK 的 streamText
  // 但 Vercel AI SDK 对 Anthropic 的支持需要 adapter
  // 直接用 Anthropic SDK 的 streaming
  const stream = await anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  });

  return stream;
}

/** 非流式生成解读（用于缓存预热） */
export async function generateReading(req: ReadingRequest): Promise<string> {
  const anthropic = createClient();
  const { systemPrompt, userPrompt } = buildReadingPrompt(req);

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  });

  // 提取文本内容
  const texts: string[] = [];
  for (const block of response.content) {
    if (block.type === 'text') {
      texts.push(block.text);
    }
  }
  return texts.join('\n');
}
