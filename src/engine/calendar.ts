// 公历↔农历互转封装（基于 lunar-typescript）
import { Lunar, Solar } from 'lunar-typescript';
import type { EarthlyBranch, HeavenlyStem, LunarDate } from './types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, hourToBranch } from './types';

/** 公历日期 → 农历信息 */
export function solarToLunar(
  year: number,
  month: number,
  day: number,
  hour: number,
): LunarDate {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  const rawMonth = lunar.getMonth(); // 负数=闰月
  const isLeapMonth = rawMonth < 0;
  const lunarMonth = Math.abs(rawMonth);

  const yearStem = lunar.getYearGan() as HeavenlyStem;
  const yearBranch = lunar.getYearZhi() as EarthlyBranch;
  const monthStem = lunar.getMonthGan() as HeavenlyStem;
  const monthBranch = lunar.getMonthZhi() as EarthlyBranch;
  const dayStem = lunar.getDayGan() as HeavenlyStem;
  const dayBranch = lunar.getDayZhi() as EarthlyBranch;

  return {
    year: lunar.getYear(),
    month: lunarMonth,
    day: lunar.getDay(),
    isLeapMonth,
    yearStem,
    yearBranch,
    monthStem,
    monthBranch,
    dayStem,
    dayBranch,
  };
}

/** 时辰数字(0-23) → 地支 */
export function hourToEarthlyBranch(hour: number): EarthlyBranch {
  return hourToBranch(hour);
}

/** 获取年干支索引(0-59) */
export function getYearSexagenaryIndex(yearStem: HeavenlyStem, yearBranch: EarthlyBranch): number {
  // 甲子=1, 而不是0-based; 但内部用0-based
  const s = HEAVENLY_STEMS.indexOf(yearStem);
  const b = EARTHLY_BRANCHES.indexOf(yearBranch);
  return (s * 6 + b * 5) % 60; // simplified calculation
}

/** 获取当前年份的天干地支 */
export function getYearStemBranch(year: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const lunar = Lunar.fromYmd(year, 1, 1);
  return {
    stem: lunar.getYearGan() as HeavenlyStem,
    branch: lunar.getYearZhi() as EarthlyBranch,
  };
}
