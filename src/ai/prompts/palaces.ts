// 十二宫分项解读 Prompt
import type { ChartData, EarthlyBranch } from '@/engine/types';
import { EARTHLY_BRANCHES } from '@/engine/types';

export function buildPalacePrompt(
  chart: ChartData,
  palaceName: string,
  focusAreas: string[],
): string {
  // 找到该宫位所在地支
  let targetBranch: EarthlyBranch | null = null;
  for (const b of EARTHLY_BRANCHES) {
    if (chart.palaces[b].name === palaceName) {
      targetBranch = b;
      break;
    }
  }

  if (!targetBranch) {
    return `请为用户解读命盘。`;
  }

  const palace = chart.palaces[targetBranch];
  const stars = [...palace.mainStars, ...palace.minorStars].join('、');

  // 找出三方四正关系
  const branchIdx = EARTHLY_BRANCHES.indexOf(targetBranch);
  const oppositeIdx = (branchIdx + 6) % 12;
  const sanFang1 = (branchIdx + 4) % 12;
  const sanFang2 = (branchIdx + 8) % 12;

  const oppositePalace = chart.palaces[EARTHLY_BRANCHES[oppositeIdx]];
  const oppositeStars = [...oppositePalace.mainStars, ...oppositePalace.minorStars].join('、');

  return `请为用户解读命盘中的【${palaceName}】。

**${palaceName}数据：**
- 宫位：${targetBranch}宫
- 主星：${palace.mainStars.join('、') || '无主星（借对宫）'}
- 辅星：${palace.minorStars.join('、') || '无'}
- 四化：${palace.sihua || '无'}
- 身宫在此：${palace.bodyPalace ? '是' : '否'}
- 对宫（${oppositePalace.name}）：${oppositeStars}

**本命盘摘要：**
- 命宫在${chart.mingPalace}，主星：${chart.palaces[chart.mingPalace].mainStars.join('、')}

**重点关注：** ${focusAreas.length ? focusAreas.join('、') : palaceName + '相关事宜'}

请解读：
1. **宫位特质**：${palaceName}代表的人生领域和核心意义
2. **星曜组合**：星曜在此宫位的具体含义
3. **三方四正**：对宫和三方宫位对本宫的影响
4. **生活建议**：与该宫位相关的实用建议`;
}
