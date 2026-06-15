// Prompt 模板导出
export { getSystemPrompt } from './system';
export { buildNatalPrompt } from './natal';

import type { ChartData } from '@/engine/types';
import { getSystemPrompt } from './system';
import { buildNatalPrompt } from './natal';
import { buildFortunePrompt } from './fortune';
import { buildPalacePrompt } from './palaces';
import { buildCompatibilityPrompt } from './compatibility';

export type ReadingType = 'natal' | 'palace' | 'daxian' | 'liunian' | 'liuyue' | 'compatibility';

export interface ReadingRequest {
  type: ReadingType;
  chart: ChartData;
  focusAreas: string[];
  palaceName?: string;
  targetYear?: number;
  targetMonth?: number;
  partnerChart?: ChartData;
}

export function buildReadingPrompt(req: ReadingRequest): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = getSystemPrompt();

  let userPrompt = '';

  switch (req.type) {
    case 'natal':
      userPrompt = buildNatalPrompt(req.chart, req.focusAreas);
      break;
    case 'palace':
      userPrompt = buildPalacePrompt(req.chart, req.palaceName || '命宫', req.focusAreas);
      break;
    case 'daxian':
      userPrompt = buildFortunePrompt(
        req.chart, '大限', req.targetYear || new Date().getFullYear(), req.focusAreas,
      );
      break;
    case 'liunian':
      userPrompt = buildFortunePrompt(
        req.chart, '流年', req.targetYear || new Date().getFullYear(), req.focusAreas,
      );
      break;
    case 'liuyue':
      userPrompt = buildFortunePrompt(
        req.chart, '流月', req.targetYear || new Date().getFullYear(),
        req.focusAreas, req.targetMonth,
      );
      break;
    case 'compatibility':
      if (req.partnerChart) {
        userPrompt = buildCompatibilityPrompt(req.chart, req.partnerChart, req.focusAreas);
      } else {
        userPrompt = buildNatalPrompt(req.chart, req.focusAreas);
      }
      break;
    default:
      userPrompt = buildNatalPrompt(req.chart, req.focusAreas);
  }

  return { systemPrompt, userPrompt };
}
