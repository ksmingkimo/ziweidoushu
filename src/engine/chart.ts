// 紫微斗数排盘主流程
import type {
  ChartData, PalaceData, EarthlyBranch, Gender,
  HeavenlyStem, MainStar, MinorStar, Transformation,
} from './types';
import {
  EARTHLY_BRANCHES, ELEMENT_BUREAU_NUMBERS,
} from './types';
import { solarToLunar, hourToEarthlyBranch } from './calendar';
import {
  calcMingPalace, calcShenPalace, assignPalaces,
  calcElementBureau, getMingPalaceStem, calcZiweiPosition,
} from './palaces';
import { placeMainStars, placeMinorStarsByYear } from './stars';
import { getSihuaByStem } from './sihua';
import { calcDaxianWithBureau } from './daxian';

/**
 * 核心排盘函数：输入公历生日+性别，输出完整命盘
 */
export function calculateChart(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  hour: number, // 0-23
  gender: Gender,
  name?: string,
): ChartData {
  // 1. 公历→农历
  const lunar = solarToLunar(solarYear, solarMonth, solarDay, hour);
  const birthHour = hourToEarthlyBranch(hour);

  // 2. 安命宫、安身宫
  const mingPalace = calcMingPalace(lunar.month, birthHour);
  const shenPalace = calcShenPalace(lunar.month, birthHour);

  // 3. 定十二宫
  const palaceAssignments = assignPalaces(mingPalace);

  // 4. 定五行局
  const elementBureau = calcElementBureau(mingPalace, lunar.yearStem);
  const bureauNum = ELEMENT_BUREAU_NUMBERS[elementBureau];

  // 5. 安十四主星（先定紫微位置）
  const ziweiBranch = calcZiweiPosition(bureauNum, lunar.day);
  const mainStarMap = placeMainStars(ziweiBranch);

  // 6. 安辅星
  const minorStarMap = placeMinorStarsByYear(
    lunar.yearBranch, lunar.yearStem,
    lunar.month, birthHour, lunar.dayBranch,
  );

  // 7. 安四化
  const sihua = getSihuaByStem(lunar.yearStem);

  // 8. 起大限
  const daxianData = calcDaxianWithBureau(
    mingPalace, gender, lunar.yearStem, bureauNum,
  );

  // 9. 组装十二宫数据
  const palaces = {} as Record<EarthlyBranch, PalaceData>;
  for (const branch of EARTHLY_BRANCHES) {
    const daxian = daxianData[branch];
    palaces[branch] = {
      name: palaceAssignments[branch],
      branch,
      mainStars: mainStarMap[branch] || [],
      minorStars: minorStarMap[branch] || [],
      sihua: null, // 将在后续赋上四化标记
      bodyPalace: branch === shenPalace,
      daxianAgeStart: daxian?.ageStart ?? 0,
      daxianAgeEnd: daxian?.ageEnd ?? 0,
      daxianStem: daxian?.stem ?? null,
      daxianBranch: daxian?.branch ?? null,
    };
  }

  // 标记四化所在的宫位
  for (const [trans, star] of Object.entries(sihua) as [Transformation, MainStar][]) {
    for (const branch of EARTHLY_BRANCHES) {
      if (palaces[branch].mainStars.includes(star)) {
        palaces[branch].sihua = trans;
        break;
      }
    }
  }

  // 10. 识别特殊格局
  const patterns = identifyPatterns(palaces, mainStarMap, sihua);

  return {
    solarDate: `${solarYear}-${String(solarMonth).padStart(2, '0')}-${String(solarDay).padStart(2, '0')}`,
    lunarDate: lunar,
    birthHour,
    gender,
    mingPalace,
    shenPalace,
    elementBureau,
    palaces,
    sihua,
    patterns,
  };
}

/** 识别特殊格局（简化版，后续可扩展） */
function identifyPatterns(
  palaces: Record<EarthlyBranch, PalaceData>,
  mainStarMap: Record<EarthlyBranch, MainStar[]>,
  sihua: Record<Transformation, MainStar>,
): string[] {
  const patterns: string[] = [];

  // 紫微在午 → 紫微朝垣格
  const mingPalace = Object.values(palaces).find(p => p.name === '命宫');
  if (mingPalace && mingPalace.mainStars.includes('紫微') && mingPalace.branch === '午') {
    patterns.push('紫微朝垣格');
  }

  // 紫微+七杀在巳亥 → 紫杀格
  if (mingPalace && mingPalace.mainStars.includes('紫微') && mingPalace.mainStars.includes('七杀')) {
    if (mingPalace.branch === '巳' || mingPalace.branch === '亥') {
      patterns.push('紫杀格');
    }
  }

  // 太阳在午 → 日照雷门
  if (mingPalace && mingPalace.mainStars.includes('太阳') && mingPalace.branch === '午') {
    patterns.push('日照雷门格');
  }

  // 太阴在亥 → 月朗天门
  if (mingPalace && mingPalace.mainStars.includes('太阴') && mingPalace.branch === '亥') {
    patterns.push('月朗天门格');
  }

  // 天同+太阴在子 → 月生沧海格
  if (mingPalace && mingPalace.mainStars.includes('天同') &&
      mingPalace.mainStars.includes('太阴') && mingPalace.branch === '子') {
    patterns.push('月生沧海格');
  }

  // 文星拱命：命宫三方有文昌文曲
  // ... (simplified for now)

  return patterns;
}
