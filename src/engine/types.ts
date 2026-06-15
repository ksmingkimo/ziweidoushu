// ============================================================
// 紫微斗数核心类型定义
// ============================================================

// ---- 天干地支 ----

/** 十天干 */
export const HEAVENLY_STEMS = [
  '甲', '乙', '丙', '丁', '戊',
  '己', '庚', '辛', '壬', '癸',
] as const;
export type HeavenlyStem = (typeof HEAVENLY_STEMS)[number];

/** 十二地支 */
export const EARTHLY_BRANCHES = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥',
] as const;
export type EarthlyBranch = (typeof EARTHLY_BRANCHES)[number];

/** 天干序号(0-9) */
export function stemIndex(s: HeavenlyStem): number {
  return HEAVENLY_STEMS.indexOf(s);
}

/** 地支序号(0-11) */
export function branchIndex(b: EarthlyBranch): number {
  return EARTHLY_BRANCHES.indexOf(b);
}

// ---- 五行 ----

export const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;
export type FiveElement = (typeof FIVE_ELEMENTS)[number];

/** 五行局（纳音五行配命宫） */
export const ELEMENT_BUREAUS = [
  '水二局', '木三局', '金四局', '土五局', '火六局',
] as const;
export type ElementBureau = (typeof ELEMENT_BUREAUS)[number];

/** 五行局对应的数字（2/3/4/5/6） */
export const ELEMENT_BUREAU_NUMBERS: Record<ElementBureau, number> = {
  '水二局': 2,
  '木三局': 3,
  '金四局': 4,
  '土五局': 5,
  '火六局': 6,
};

// ---- 阴阳 ----

export type YinYang = '阳' | '阴';

// ---- 十二宫 ----

export const PALACE_NAMES = [
  '命宫', '兄弟', '夫妻', '子女',
  '财帛', '疾厄', '迁移', '交友',
  '事业', '田宅', '福德', '父母',
] as const;
export type PalaceName = (typeof PALACE_NAMES)[number];

/** 十二宫在地支盘上的固定位置（命宫在寅时的标准盘） */
export const PALACE_POSITIONS: Record<EarthlyBranch, PalaceName> = {
  '寅': '命宫',
  '卯': '兄弟',
  '辰': '夫妻',
  '巳': '子女',
  '午': '财帛',
  '未': '疾厄',
  '申': '迁移',
  '酉': '交友',
  '戌': '事业',
  '亥': '田宅',
  '子': '福德',
  '丑': '父母',
};

// ---- 十四主星 ----

export const MAIN_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
  '天府', '太阴', '贪狼', '巨门', '天相', '天梁',
  '七杀', '破军',
] as const;
export type MainStar = (typeof MAIN_STARS)[number];

/** 主星五行属性 */
export const MAIN_STAR_ELEMENT: Record<MainStar, FiveElement> = {
  '紫微': '土', '天机': '木', '太阳': '火', '武曲': '金',
  '天同': '水', '廉贞': '火', '天府': '土', '太阴': '水',
  '贪狼': '木', '巨门': '水', '天相': '水', '天梁': '土',
  '七杀': '金', '破军': '水',
};

/** 主星阴阳属性 */
export const MAIN_STAR_YINYANG: Record<MainStar, YinYang> = {
  '紫微': '阴', '天机': '阴', '太阳': '阳', '武曲': '阴',
  '天同': '阳', '廉贞': '阴', '天府': '阳', '太阴': '阴',
  '贪狼': '阳', '巨门': '阴', '天相': '阳', '天梁': '阳',
  '七杀': '阳', '破军': '阳',
};

// ---- 辅星 ----

export const MINOR_STARS = [
  '左辅', '右弼', '文昌', '文曲',
  '天魁', '天钺', '禄存',
  '擎羊', '陀罗', '火星', '铃星',
  '地空', '地劫',
  '天马',
] as const;
export type MinorStar = (typeof MINOR_STARS)[number];

// ---- 四化 ----

export const TRANSFORMATIONS = ['禄', '权', '科', '忌'] as const;
export type Transformation = (typeof TRANSFORMATIONS)[number];

/** 天干四化表: 每个天干对应的四化星 */
export const STEM_SIHUA_MAP: Record<HeavenlyStem, Record<Transformation, MainStar>> = {
  '甲': { '禄': '廉贞', '权': '破军', '科': '武曲', '忌': '太阳' },
  '乙': { '禄': '天机', '权': '天梁', '科': '紫微', '忌': '太阴' },
  '丙': { '禄': '天同', '权': '天机', '科': '文昌' as MainStar, '忌': '廉贞' },
  '丁': { '禄': '太阴', '权': '天同', '科': '天机', '忌': '巨门' },
  '戊': { '禄': '贪狼', '权': '太阴', '科': '右弼' as MainStar, '忌': '天机' },
  '己': { '禄': '武曲', '权': '贪狼', '科': '天梁', '忌': '文曲' as MainStar },
  '庚': { '禄': '太阳', '权': '武曲', '科': '太阴', '忌': '天同' },
  '辛': { '禄': '巨门', '权': '太阳', '科': '文曲' as MainStar, '忌': '文昌' as MainStar },
  '壬': { '禄': '天梁', '权': '紫微', '科': '左辅' as MainStar, '忌': '武曲' },
  '癸': { '禄': '破军', '权': '巨门', '科': '太阴', '忌': '贪狼' },
};

// ---- 六十甲子 ----

/** 天干地支组合序号(0-59) */
export function sexagenaryIndex(stem: HeavenlyStem, branch: EarthlyBranch): number {
  const s = stemIndex(stem);
  const b = branchIndex(branch);
  // 六十甲子：天干地支必须同奇偶
  if ((s % 2) !== (b % 2)) return -1; // 无效组合
  // 甲子=0
  return ((s - b + 12) % 10) * 6 + b; // simplified: (s*6 + b*? )
}

// ---- 时辰 ----

export const TWO_HOUR_NAMES = [
  '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
  '午时', '未时', '申时', '酉时', '戌时', '亥时',
] as const;
export type TwoHourName = (typeof TWO_HOUR_NAMES)[number];

/** 时辰对应的小时范围 */
export const TWO_HOUR_RANGES: Record<EarthlyBranch, [number, number]> = {
  '子': [23, 1],
  '丑': [1, 3],
  '寅': [3, 5],
  '卯': [5, 7],
  '辰': [7, 9],
  '巳': [9, 11],
  '午': [11, 13],
  '未': [13, 15],
  '申': [15, 17],
  '酉': [17, 19],
  '戌': [19, 21],
  '亥': [21, 23],
};

/** 小时(0-23) → 时辰地支 */
export function hourToBranch(hour: number): EarthlyBranch {
  const branches: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  // 23点→子, 0点→子, 1点→丑, ...
  const idx = Math.floor(((hour + 1) % 24) / 2);
  return branches[idx];
}

// ---- 性别 ----

export type Gender = '男' | '女';

// ---- 农历日期 ----

export interface LunarDate {
  year: number;        // 农历年（以正月初一为界）
  month: number;       // 1-12
  day: number;         // 1-30
  isLeapMonth: boolean;
  yearStem: HeavenlyStem;
  yearBranch: EarthlyBranch;
  monthStem: HeavenlyStem;
  monthBranch: EarthlyBranch;
  dayStem: HeavenlyStem;
  dayBranch: EarthlyBranch;
}

// ---- 命盘核心类型 ----

/** 宫位内包含的数据 */
export interface PalaceData {
  name: PalaceName;              // 宫位名称
  branch: EarthlyBranch;         // 所在地址
  mainStars: MainStar[];         // 主星
  minorStars: MinorStar[];       // 辅星
  sihua: Transformation | null;  // 四化标记
  bodyPalace: boolean;           // 是否身宫
  daxianAgeStart: number;        // 大限起始年龄
  daxianAgeEnd: number;          // 大限结束年龄
  daxianStem: HeavenlyStem | null;
  daxianBranch: EarthlyBranch | null;
}

/** 完整命盘 */
export interface ChartData {
  // 基本信息
  solarDate: string;       // 公历日期 YYYY-MM-DD
  lunarDate: LunarDate;
  birthHour: EarthlyBranch;
  gender: Gender;

  // 命宫/身宫
  mingPalace: EarthlyBranch;     // 命宫所在地支
  shenPalace: EarthlyBranch;     // 身宫所在地支
  elementBureau: ElementBureau;  // 五行局

  // 十二宫数据（按地支顺序 子丑寅卯...）
  palaces: Record<EarthlyBranch, PalaceData>;

  // 四化
  sihua: Record<Transformation, MainStar>;

  // 特殊格局标记
  patterns: string[];
}

/** 流年/流月/流日 运势 */
export interface FortuneData {
  period: string;                // 时期标记 "2026年" / "2026年6月"
  taiSuiBranch: EarthlyBranch;   // 太岁/流年地支
  liuNianStem: HeavenlyStem;     // 流年天干
  palaces: Record<EarthlyBranch, PalaceData>;           // 流年盘十二宫
  liuNianSihua: Record<Transformation, MainStar>;       // 流年四化
}

/** 合盘 */
export interface CompatibilityData {
  chart1: ChartData;
  chart2: ChartData;
  overlaps: {
    branch: EarthlyBranch;
    palace1: PalaceName;
    palace2: PalaceName;
  }[];
  score: number;               // 综合评分 0-100
}
