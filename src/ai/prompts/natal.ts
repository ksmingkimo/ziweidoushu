// 本命盘解读 Prompt 模板
import type { ChartData, EarthlyBranch } from '@/engine/types';
import { EARTHLY_BRANCHES } from '@/engine/types';

export function buildNatalPrompt(chart: ChartData, focusAreas: string[]): string {
  // 提取命宫信息
  const mingPalace = chart.palaces[chart.mingPalace];
  const mingStars = mingPalace.mainStars.join('、');
  const mingMinor = mingPalace.minorStars.join('、');

  return `请为用户解读【本命盘】——这是紫微斗数中最重要的命盘，反映一个人的先天性格、天赋和人生格局。

**用户基本信息：**
- 公历出生：${chart.solarDate} ${chart.birthHour}时
- 农历出生：${chart.lunarDate.yearStem}${chart.lunarDate.yearBranch}年 ${chart.lunarDate.month}月${chart.lunarDate.isLeapMonth ? '（闰）' : ''}${chart.lunarDate.day}日
- 性别：${chart.gender}

**命盘核心数据：**
- 命宫在：${chart.mingPalace}（主星：${mingStars}${mingMinor ? '，辅星：' + mingMinor : ''}）
- 身宫在：${chart.shenPalace}
- 五行局：${chart.elementBureau}
- 四化：禄→${chart.sihua['禄']}、权→${chart.sihua['权']}、科→${chart.sihua['科']}、忌→${chart.sihua['忌']}
${chart.patterns.length ? '- 特殊格局：' + chart.patterns.join('、') : ''}

**十二宫星曜分布：**
${generatePalaceSummary(chart)}

**重点关注：** ${focusAreas.length ? focusAreas.join('、') : '整体性格与人生格局'}

请按照以下结构为本命盘撰写解读：
1. **命宫核心**：命宫主星组合的性格特质
2. **十二宫巡览**：各宫位的重要星曜和影响
3. **四化点睛**：四化在命盘中的关键作用
4. **人生建议**：基于命盘的成长方向和建议`;
}

function generatePalaceSummary(chart: ChartData): string {
  const branches: EarthlyBranch[] = [...EARTHLY_BRANCHES];
  const lines: string[] = [];
  for (const b of branches) {
    const p = chart.palaces[b];
    const stars = [...p.mainStars, ...p.minorStars].filter(Boolean);
    if (stars.length > 0) {
      const marker = p.bodyPalace ? ' [身]' : '';
      lines.push(`- ${b}宫(${p.name})${marker}：${stars.join('、')}${p.sihua ? ' [' + p.sihua + ']' : ''}`);
    }
  }
  return lines.join('\n');
}
