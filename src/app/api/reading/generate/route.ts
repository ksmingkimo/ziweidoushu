// POST /api/reading/generate — AI 解读生成（SSE 流式）
import { NextRequest } from 'next/server';
import { generateReadingStream } from '@/ai/claude';
import { getCacheKey, getCachedReading, setCachedReading } from '@/ai/cache';
import { calculateChart } from '@/engine/chart';
import type { ReadingType } from '@/ai/prompts';
import type { Gender } from '@/engine/types';

export const runtime = 'nodejs'; // Anthropic SDK needs Node runtime
export const maxDuration = 60; // Vercel Pro: 60s max

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      chartData,       // 已有命盘数据（可选）
      solarYear, solarMonth, solarDay, hour, gender, // 或提供出生信息现排
      readingType = 'natal',
      focusAreas = [],
      palaceName,
      targetYear,
      targetMonth,
      forceRefresh = false,
    } = body;

    // 获取命盘数据
    let chart;
    if (chartData) {
      chart = chartData;
    } else if (solarYear && solarMonth && solarDay && hour != null && gender) {
      chart = calculateChart(
        Number(solarYear), Number(solarMonth), Number(solarDay),
        Number(hour), gender as Gender,
      );
    } else {
      return new Response(
        JSON.stringify({ error: '请提供命盘数据或出生信息' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 检查缓存
    const cacheKey = getCacheKey(chart, readingType as ReadingType);
    if (!forceRefresh) {
      const cached = getCachedReading(cacheKey);
      if (cached) {
        // 命中缓存，流式输出缓存的文本（模拟流式效果）
        return streamCachedContent(cached.content);
      }
    }

    // 调用 Claude API
    const stream = await generateReadingStream({
      type: readingType as ReadingType,
      chart,
      focusAreas,
      palaceName,
      targetYear,
      targetMonth,
    });

    // 创建 ReadableStream 用于 SSE
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        let fullContent = '';

        try {
          // 发送初始事件
          controller.enqueue(encoder.encode('event: start\ndata: {}\n\n'));

          for await (const chunk of stream) {
            const text = chunk.text;
            fullContent += text;
            // SSE 格式
            const data = JSON.stringify({ text });
            controller.enqueue(encoder.encode(`event: delta\ndata: ${data}\n\n`));
          }

          // 发送完成事件
          const completeData = JSON.stringify({
            done: true,
            content: fullContent,
          });
          controller.enqueue(encoder.encode(`event: done\ndata: ${completeData}\n\n`));

          // 写入缓存
          // estimate tokens (rough: chars/3)
          const estimatedTokens = Math.ceil(fullContent.length / 3);
          setCachedReading(cacheKey, fullContent, estimatedTokens);
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : '生成解读时发生错误';
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ error: errMsg })}\n\n`),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('解读生成失败:', error);
    return new Response(
      JSON.stringify({ error: '解读生成失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

/** 流式输出缓存内容（模拟打字效果） */
function streamCachedContent(content: string): Response {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      const chunks = content.match(/.{1,10}/g) || [content];
      controller.enqueue(encoder.encode('event: start\ndata: {}\n\n'));

      for (const chunk of chunks) {
        const data = JSON.stringify({ text: chunk });
        controller.enqueue(encoder.encode(`event: delta\ndata: ${data}\n\n`));
        await new Promise(resolve => setTimeout(resolve, 30)); // 模拟延迟
      }

      controller.enqueue(
        encoder.encode(`event: done\ndata: ${JSON.stringify({ done: true, cached: true })}\n\n`),
      );
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
