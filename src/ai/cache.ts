// AI 解读缓存策略
// 相同命盘 + 相同解读类型 → 可复用缓存
// 使用 Redis (Upstash) 在生产环境，内存缓存用于开发

import { createHash } from 'crypto';
import type { ChartData } from '@/engine/types';
import type { ReadingType } from './prompts';

interface CacheEntry {
  content: string;
  tokensUsed: number;
  createdAt: number;
}

// 内存缓存（开发环境）
const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 小时

/** 生成缓存键 */
export function getCacheKey(chart: ChartData, type: ReadingType): string {
  // 用命盘关键数据哈希
  const data = JSON.stringify({
    mingPalace: chart.mingPalace,
    birthHour: chart.birthHour,
    gender: chart.gender,
    lunarDate: {
      year: chart.lunarDate.year,
      month: chart.lunarDate.month,
      day: chart.lunarDate.day,
    },
    type,
  });
  return createHash('md5').update(data).digest('hex');
}

/** 从缓存获取 */
export function getCachedReading(key: string): CacheEntry | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  // 检查过期
  if (Date.now() - entry.createdAt > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }

  return entry;
}

/** 写入缓存 */
export function setCachedReading(key: string, content: string, tokensUsed: number): void {
  memoryCache.set(key, {
    content,
    tokensUsed,
    createdAt: Date.now(),
  });

  // 限制缓存大小
  if (memoryCache.size > 1000) {
    const oldest = [...memoryCache.entries()]
      .sort((a, b) => a[1].createdAt - b[1].createdAt)[0];
    if (oldest) memoryCache.delete(oldest[0]);
  }
}

/** 清除所有缓存 */
export function clearCache(): void {
  memoryCache.clear();
}
