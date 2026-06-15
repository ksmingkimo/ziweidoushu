// 合盘解读 Prompt
import type { ChartData, EarthlyBranch } from '@/engine/types';
import { EARTHLY_BRANCHES } from '@/engine/types';

export function buildCompatibilityPrompt(
  chart1: ChartData,
  chart2: ChartData,
  focusAreas: string[],
): string {
  return `请为用户解读【双人合盘】——分析两人的性格契合度和关系走势。

**甲方命盘：**
- 公历：${chart1.solarDate} ${chart1.birthHour}时
- 命宫在${chart1.mingPalace}，主星：${chart1.palaces[chart1.mingPalace].mainStars.join('、')}
- 夫妻宫主星：${getPalaceStars(chart1, '夫妻')}

**乙方命盘：**
- 公历：${chart2.solarDate} ${chart2.birthHour}时
- 命宫在${chart2.mingPalace}，主星：${chart2.palaces[chart2.mingPalace].mainStars.join('、')}
- 夫妻宫主星：${getPalaceStars(chart2, '夫妻')}

**重点关注：** ${focusAreas.length ? focusAreas.join('、') : '感情契合度'}

请分析：
1. **性格契合度**：两人命宫主星的配合程度
2. **感情模式**：双方夫妻宫的互动特点
3. **优势与挑战**：关系中天然的优势和需要注意的方面
4. **相处建议**：提升关系质量的实用建议`;
}

function getPalaceStars(chart: ChartData, palaceName: string): string {
  for (const branch of EARTHLY_BRANCHES) {
    if (chart.palaces[branch].name === palaceName) {
      return chart.palaces[branch].mainStars.join('、') || '无主星';
    }
  }
  return '未知';
}
