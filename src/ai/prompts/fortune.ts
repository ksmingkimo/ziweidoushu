// 流年/大限/流月解读 Prompt
import type { ChartData } from '@/engine/types';
import { calcLiuNian, calcLiuYue } from '@/engine/liunian';

export function buildFortunePrompt(
  chart: ChartData,
  type: '大限' | '流年' | '流月',
  year: number,
  focusAreas: string[],
  month?: number,
): string {
  const fortune = type === '流月' && month
    ? calcLiuYue(chart, year, month)
    : calcLiuNian(chart, year);

  const periodLabel = type === '流月' && month
    ? `${year}年${month}月`
    : `${year}年`;

  // 找流年命宫
  const liuNianMingPalace = fortune.palaces[fortune.taiSuiBranch];

  return `请为用户解读【${type}运势】——${periodLabel}。

**流年基本信息：**
- 流年干支：${fortune.liuNianStem}${fortune.taiSuiBranch}
- 流年四化：禄→${fortune.liuNianSihua['禄']}、权→${fortune.liuNianSihua['权']}、科→${fortune.liuNianSihua['科']}、忌→${fortune.liuNianSihua['忌']}

**本命盘摘要：**
- 命宫在${chart.mingPalace}，主星：${chart.palaces[chart.mingPalace].mainStars.join('、')}
- 四化：禄→${chart.sihua['禄']}、权→${chart.sihua['权']}、科→${chart.sihua['科']}、忌→${chart.sihua['忌']}

**重点关注：** ${focusAreas.length ? focusAreas.join('、') : '整体运势'}

请围绕以下方面解读${type}运势：
1. **总体趋势**：${type}的主旋律和关键词
2. **重点领域**：财运、事业、感情等方面的具体走势
3. **注意事项**：需要留意的月份或事项
4. **行动建议**：${type}的趋吉避凶之道`;
}
