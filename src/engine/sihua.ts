// 四化（禄权科忌）计算
import type { HeavenlyStem, EarthlyBranch, MainStar, Transformation } from './types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, TRANSFORMATIONS, STEM_SIHUA_MAP } from './types';

/** 根据天干获取四化星 */
export function getSihuaByStem(stem: HeavenlyStem): Record<Transformation, MainStar> {
  return { ...STEM_SIHUA_MAP[stem] };
}

/** 找出某星被化禄/权/科/忌的天干 */
export function findSihuaStem(star: MainStar, transformation: Transformation): HeavenlyStem[] {
  const stems: HeavenlyStem[] = [];
  for (const stem of HEAVENLY_STEMS) {
    if (STEM_SIHUA_MAP[stem][transformation] === star) {
      stems.push(stem);
    }
  }
  return stems;
}

/** 流年四化：根据流年天干计算 */
export function getLiuNianSihua(yearStem: HeavenlyStem): Record<Transformation, MainStar> {
  return getSihuaByStem(yearStem);
}
