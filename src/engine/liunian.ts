// 流年、流月、流日推算
import type { EarthlyBranch, HeavenlyStem, MainStar, Transformation, ChartData, FortuneData, PalaceData } from './types';
import { EARTHLY_BRANCHES, HEAVENLY_STEMS, PALACE_NAMES } from './types';
import { getSihuaByStem } from './sihua';
import { assignPalaces, wuhudun } from './palaces';
import type { DaxianInfo } from './daxian';

/** 获取某年的干支 */
export function getYearStemBranch(year: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  // 1984年是甲子年
  const baseYear = 1984;
  const diff = year - baseYear;
  const stemIdx = ((diff % 10) + 10) % 10; // handle negative
  const branchIdx = ((diff % 12) + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
  };
}

/** 流年盘计算 */
export function calcLiuNian(
  baseChart: ChartData,
  targetYear: number,
): FortuneData {
  const { stem: liuNianStem, branch: taiSuiBranch } = getYearStemBranch(targetYear);
  const liuNianSihua = getSihuaByStem(liuNianStem);

  // 流年命宫 = 以太岁地支为该年命宫
  // 但实际上流年命宫固定在 寅 太岁...
  // Standard: 流年命宫 = 太岁所在宫位
  const liuNianMingPalace = taiSuiBranch;
  const palaceAssignments = assignPalaces(liuNianMingPalace);

  // 流年盘 = 以本命盘为基础，叠加流年太岁和四化
  // 简化处理：复制本命盘宫位数据，更新流年相关信息
  const palaces = {} as Record<EarthlyBranch, PalaceData>;

  for (const branch of EARTHLY_BRANCHES) {
    const basePalace = baseChart.palaces[branch];
    palaces[branch] = {
      ...basePalace,
      name: palaceAssignments[branch],
      // 流年四化覆盖在原盘上
    };
  }

  // 标记流年四化所在宫位
  for (const [trans, star] of Object.entries(liuNianSihua) as [Transformation, MainStar][]) {
    for (const branch of EARTHLY_BRANCHES) {
      if (palaces[branch].mainStars.includes(star) && !palaces[branch].sihua) {
        palaces[branch] = { ...palaces[branch], sihua: trans };
        break;
      }
    }
  }

  return {
    period: `${targetYear}年`,
    taiSuiBranch,
    liuNianStem,
    palaces,
    liuNianSihua,
  };
}

/** 流月盘计算 */
export function calcLiuYue(
  baseChart: ChartData,
  targetYear: number,
  targetMonth: number, // 农历月 1-12
): FortuneData {
  const { stem: yearStem } = getYearStemBranch(targetYear);

  // 流月地支：从寅起正月
  const monthBranchIdx = (targetMonth - 1 + 2) % 12; // 寅=正月
  const monthBranch = EARTHLY_BRANCHES[monthBranchIdx];

  // 流月天干：五虎遁法
  const yinMonthStem = wuhudun(yearStem);
  const yinStemIdx = HEAVENLY_STEMS.indexOf(yinMonthStem);
  const monthStemIdx = (yinStemIdx + (monthBranchIdx - 2 + 12) % 12) % 10;
  const monthStem = HEAVENLY_STEMS[monthStemIdx];

  const liuYueSihua = getSihuaByStem(monthStem);

  // 流月命宫：从流年命宫起正月，逆数至目标月，再从该处起子时...
  // Simplified for now
  const palaces = {} as Record<EarthlyBranch, PalaceData>;
  for (const branch of EARTHLY_BRANCHES) {
    palaces[branch] = { ...baseChart.palaces[branch] };
  }

  return {
    period: `${targetYear}年${targetMonth}月`,
    taiSuiBranch: monthBranch,
    liuNianStem: monthStem,
    palaces,
    liuNianSihua: liuYueSihua,
  };
}

/** 流日盘计算 */
export function calcLiuRi(
  baseChart: ChartData,
  targetYear: number,
  targetMonth: number,
  targetDay: number,
): FortuneData {
  // Simplified - full implementation would need daily stem/branch calculation
  const { stem: yearStem, branch: yearBranch } = getYearStemBranch(targetYear);

  return {
    period: `${targetYear}年${targetMonth}月${targetDay}日`,
    taiSuiBranch: yearBranch,
    liuNianStem: yearStem,
    palaces: baseChart.palaces,
    liuNianSihua: getSihuaByStem(yearStem),
  };
}
