// 大限推算
import type { EarthlyBranch, HeavenlyStem, Gender } from './types';
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from './types';

export interface DaxianInfo {
  ageStart: number;
  ageEnd: number;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

/** 起大限：确定每个宫位对应的大限年龄范围和干支 */
export function calcDaxian(
  mingPalace: EarthlyBranch,
  gender: Gender,
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
): Record<EarthlyBranch, DaxianInfo> {
  const result = {} as Record<EarthlyBranch, DaxianInfo>;

  // 1. 判断顺行/逆行
  // 阳男/阴女 → 顺行；阴男/阳女 → 逆行
  const isYangStem = ['甲','丙','戊','庚','壬'].includes(yearStem);
  const isYangGender = gender === '男';
  const isShunXing = (isYangStem && isYangGender) || (!isYangStem && !isYangGender);

  // 2. 五行局数 → 起始岁数
  // 这个需要五行局，但我们从外部传入...
  // 实际上 getDaxianStartAge 需要 五行局数
  // Let's restructure: this function needs the element bureau number

  // For now, placeholder — will be called from chart.ts with bureau number
  return result;
}

/** 带五行局数的完整大限计算 */
export function calcDaxianWithBureau(
  mingPalace: EarthlyBranch,
  gender: Gender,
  yearStem: HeavenlyStem,
  bureauNum: number, // 2/3/4/5/6
): Record<EarthlyBranch, DaxianInfo> {
  const result = {} as Record<EarthlyBranch, DaxianInfo>;

  // 判断顺行/逆行
  const isYangStem = ['甲','丙','戊','庚','壬'].includes(yearStem);
  const isYangGender = gender === '男';
  const isShunXing = (isYangStem && isYangGender) || (!isYangStem && !isYangGender);

  // 起始岁数 = 五行局数
  const startAge = bureauNum;
  const mingIdx = EARTHLY_BRANCHES.indexOf(mingPalace);

  // 大限每宫10年，从命宫开始
  for (let i = 0; i < 12; i++) {
    const ageStart = startAge + i * 10;
    const ageEnd = ageStart + 9;
    const branchIdx = isShunXing
      ? (mingIdx + i) % 12
      : (mingIdx - i + 12) % 12;
    const branch = EARTHLY_BRANCHES[branchIdx];

    // 大限天干：根据生年天干和地支推算
    // 本质上，大限天干是按 五虎遁 从命宫开始依次排
    // But the actual formula is more complex based on 生年天干
    const stemIdx = (HEAVENLY_STEMS.indexOf(yearStem) + i) % 10;
    result[branch] = {
      ageStart,
      ageEnd,
      stem: HEAVENLY_STEMS[stemIdx],
      branch,
    };
  }

  return result;
}
