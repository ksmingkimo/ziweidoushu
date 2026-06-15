// 十二宫定位、命宫/身宫计算
import type { EarthlyBranch, PalaceName, HeavenlyStem, Gender } from './types';
import {
  EARTHLY_BRANCHES, PALACE_NAMES, HEAVENLY_STEMS, ELEMENT_BUREAUS,
} from './types';
import type { ElementBureau } from './types';

/** 安命宫：根据农历生月、生时确定命宫所在地支 */
export function calcMingPalace(lunarMonth: number, birthHourBranch: EarthlyBranch): EarthlyBranch {
  const hourIdx = EARTHLY_BRANCHES.indexOf(birthHourBranch);
  // 从寅宫起正月，逆数到出生月；再从该处起子时，顺数到出生时
  // 等价公式：命宫索引 = (寅(2) + 时辰索引 - 月 + 1 + 12) % 12
  const idx = (2 + hourIdx - lunarMonth + 1 + 12) % 12;
  return EARTHLY_BRANCHES[idx];
}

/** 安身宫：根据农历生月、生时确定身宫所在地支 */
export function calcShenPalace(lunarMonth: number, birthHourBranch: EarthlyBranch): EarthlyBranch {
  const hourIdx = EARTHLY_BRANCHES.indexOf(birthHourBranch);
  // 身宫 = (寅 + 月 - 1 + 时辰) % 12
  const idx = (2 + lunarMonth - 1 + hourIdx) % 12;
  return EARTHLY_BRANCHES[idx];
}

/** 定十二宫：从命宫开始逆时针排列十二宫名称 */
export function assignPalaces(mingPalace: EarthlyBranch): Record<EarthlyBranch, PalaceName> {
  const result = {} as Record<EarthlyBranch, PalaceName>;
  const mingIdx = EARTHLY_BRANCHES.indexOf(mingPalace);
  for (let i = 0; i < 12; i++) {
    // 逆时针：命宫 → 兄弟 → 夫妻 → ...
    const branchIdx = (mingIdx - i + 12) % 12;
    result[EARTHLY_BRANCHES[branchIdx]] = PALACE_NAMES[i];
  }
  return result;
}

/** 五虎遁：根据年干确定寅月天干 */
export function wuhudun(yearStem: HeavenlyStem): HeavenlyStem {
  // 甲己之年丙作首, 乙庚之年戊为头
  // 丙辛之年庚为头, 丁壬之年壬为头
  // 戊癸之年甲为头
  const map: Record<HeavenlyStem, HeavenlyStem> = {
    '甲': '丙', '己': '丙',
    '乙': '戊', '庚': '戊',
    '丙': '庚', '辛': '庚',
    '丁': '壬', '壬': '壬',
    '戊': '甲', '癸': '甲',
  };
  return map[yearStem];
}

/** 根据年干和地支求该地支的天干（月份天干推算） */
export function getMonthStem(yearStem: HeavenlyStem, targetBranch: EarthlyBranch): HeavenlyStem {
  const yinMonthStem = wuhudun(yearStem);
  const yinIdx = HEAVENLY_STEMS.indexOf(yinMonthStem);
  const targetIdx = EARTHLY_BRANCHES.indexOf(targetBranch);
  // 寅月天干 + (目标地支索引 - 寅索引)
  const stemIdx = (yinIdx + (targetIdx - 2 + 12) % 12) % 10;
  return HEAVENLY_STEMS[stemIdx];
}

/** 纳音五行表：60甲子每对(2个一组)的五行 */
const NAYIN_ELEMENTS: Record<string, '金' | '木' | '水' | '火' | '土'> = {
  '甲子': '金', '乙丑': '金',
  '丙寅': '火', '丁卯': '火',
  '戊辰': '木', '己巳': '木',
  '庚午': '土', '辛未': '土',
  '壬申': '金', '癸酉': '金',
  '甲戌': '火', '乙亥': '火',
  '丙子': '水', '丁丑': '水',
  '戊寅': '土', '己卯': '土',
  '庚辰': '金', '辛巳': '金',
  '壬午': '木', '癸未': '木',
  '甲申': '水', '乙酉': '水',
  '丙戌': '土', '丁亥': '土',
  '戊子': '火', '己丑': '火',
  '庚寅': '木', '辛卯': '木',
  '壬辰': '水', '癸巳': '水',
  '甲午': '金', '乙未': '金',
  '丙申': '火', '丁酉': '火',
  '戊戌': '木', '己亥': '木',
  '庚子': '土', '辛丑': '土',
  '壬寅': '金', '癸卯': '金',
  '甲辰': '火', '乙巳': '火',
  '丙午': '水', '丁未': '水',
  '戊申': '土', '己酉': '土',
  '庚戌': '金', '辛亥': '金',
  '壬子': '木', '癸丑': '木',
  '甲寅': '水', '乙卯': '水',
  '丙辰': '土', '丁巳': '土',
  '戊午': '火', '己未': '火',
  '庚申': '木', '辛酉': '木',
  '壬戌': '水', '癸亥': '水',
};

/** 五行 → 五行局映射 */
const ELEMENT_TO_BUREAU: Record<string, ElementBureau> = {
  '金': '金四局',
  '木': '木三局',
  '水': '水二局',
  '火': '火六局',
  '土': '土五局',
};

/** 定五行局：根据命宫天干地支查纳音，确定五行局 */
export function calcElementBureau(
  mingPalaceBranch: EarthlyBranch,
  yearStem: HeavenlyStem,
): ElementBureau {
  const mingPalaceStem = getMonthStem(yearStem, mingPalaceBranch);
  const key = `${mingPalaceStem}${mingPalaceBranch}`;
  const element = NAYIN_ELEMENTS[key];
  if (!element) {
    // fallback
    return '水二局';
  }
  return ELEMENT_TO_BUREAU[element];
}

/** 计算命宫天干 */
export function getMingPalaceStem(yearStem: HeavenlyStem, mingPalaceBranch: EarthlyBranch): HeavenlyStem {
  return getMonthStem(yearStem, mingPalaceBranch);
}

/** 安紫微星：根据五行局数和农历生日确定紫微星所在支位 */
export function calcZiweiPosition(bureauNumber: number, lunarDay: number): EarthlyBranch {
  // 核心算法: 紫微位置 = 寅 + floor((day - 1) / bureauNumber)
  const step = Math.floor((lunarDay - 1) / bureauNumber);
  const idx = (2 + step) % 12; // 寅=索引2
  return EARTHLY_BRANCHES[idx];
}
