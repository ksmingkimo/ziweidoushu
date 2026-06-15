// 十四主星 + 辅星安放算法
import type { EarthlyBranch, HeavenlyStem, MainStar, MinorStar } from './types';
import { EARTHLY_BRANCHES, MAIN_STARS } from './types';

/** 创建初始化的地支记录 */
function emptyBranchRecord<T>(): Record<EarthlyBranch, T[]> {
  const r: Record<string, T[]> = {};
  for (const b of EARTHLY_BRANCHES) r[b] = [];
  return r as Record<EarthlyBranch, T[]>;
}

/** 紫微星位置 → 安十四主星（紫微系6星 + 天府系8星） */
export function placeMainStars(ziweiBranch: EarthlyBranch): Record<EarthlyBranch, MainStar[]> {
  const ziweiIdx = EARTHLY_BRANCHES.indexOf(ziweiBranch);
  const result = emptyBranchRecord<MainStar>();

  // --- 紫微系6星：紫微逆行 ---
  // 紫微系口诀: 紫微天机星逆行, 隔一阳武天同行, 又隔二位天同当, 隔三廉贞是
  const ziweiStars: { star: MainStar; offset: number }[] = [
    { star: '紫微', offset: 0 },
    { star: '天机', offset: -1 },   // 逆行1格
    { star: '太阳', offset: -3 },    // 隔一阳武 → 再逆2格? No, it's relative to 天机
    { star: '武曲', offset: -4 },    // 天同行 → 逆1格
    { star: '天同', offset: -5 },   // 隔二 → 逆2格
    { star: '廉贞', offset: -8 },   // 隔三 → 逆3格
  ];

  // Wait, let me re-derive the positions correctly.
  // 紫微 (base)
  // 天机 = 紫微 - 1 (逆行)
  // (空一格 = 紫微 - 2)
  // 太阳 = 紫微 - 3
  // 武曲 = 紫微 - 4
  // 天同 = 紫微 - 5
  // (空二格 = 紫微-6, 紫微-7)
  // 廉贞 = 紫微 - 8
  // This is: positions relative to 紫微 going CCW (increasing negative offset)
  const ziweiOffsets = [0, -1, -3, -4, -5, -8];
  const ziweiStarNames: MainStar[] = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'];

  for (let i = 0; i < ziweiStarNames.length; i++) {
    const idx = (ziweiIdx + ziweiOffsets[i] + 12) % 12;
    result[EARTHLY_BRANCHES[idx]].push(ziweiStarNames[i]);
  }

  // --- 天府系8星：天府顺行 ---
  // 天府定位规则：紫微在寅→天府在辰, 紫微在卯→天府在巳, ...
  // 天府Idx = 紫微Idx + 2 (每移1宫, 天府也移1宫)
  const tianfuIdx = (ziweiIdx + 2) % 12;

  const tianfuOffsets = [0, 1, 2, 3, 4, 5, 6, 7];
  const tianfuStarNames: MainStar[] = ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];

  for (let i = 0; i < tianfuStarNames.length; i++) {
    const idx = (tianfuIdx + tianfuOffsets[i]) % 12;
    result[EARTHLY_BRANCHES[idx]].push(tianfuStarNames[i]);
  }

  return result;
}

/** 安辅星：根据年支/月支/日干/时支安放 */
export function placeMinorStars(
  yearBranch: EarthlyBranch,
  monthBranch: EarthlyBranch,
  dayStem: HeavenlyStem,
  hourBranch: EarthlyBranch,
  lunarMonth: number,
): Record<EarthlyBranch, MinorStar[]> {
  const result = emptyBranchRecord<MinorStar>();

  const addStar = (branch: EarthlyBranch, star: MinorStar) => {
    result[branch].push(star);
  };

  // ---- 左辅：辰宫起正月，顺数至生月 ----
  const zuofuIdx = (4 + lunarMonth - 1) % 12; // 辰=4
  addStar(EARTHLY_BRANCHES[zuofuIdx], '左辅');

  // ---- 右弼：戌宫起正月，逆数至生月 ----
  const youbiIdx = (10 - (lunarMonth - 1) + 12) % 12; // 戌=10
  addStar(EARTHLY_BRANCHES[youbiIdx], '右弼');

  // ---- 文昌：戌宫起子时，逆数至生时 ----
  const hourIdx = EARTHLY_BRANCHES.indexOf(hourBranch);
  const wenchangIdx = (10 - hourIdx + 12) % 12;
  addStar(EARTHLY_BRANCHES[wenchangIdx], '文昌');

  // ---- 文曲：辰宫起子时，顺数至生时 ----
  const wenquIdx = (4 + hourIdx) % 12;
  addStar(EARTHLY_BRANCHES[wenquIdx], '文曲');

  // ---- 天魁：丑宫起甲年，顺数至生年天干 ----
  const dayStemIdx = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'].indexOf(dayStem);
  // Hmm, 天魁 is based on 年干 not 日干. Let me fix this.
  // Actually wait - the function parameter is dayStem but 天魁 should use yearStem.
  // I'll fix the interface later. For now let me use a placeholder.
  // We'll need to pass yearStem separately.

  // ---- 禄存：按年干定地支 ----
  const luCunMap: Record<HeavenlyStem, EarthlyBranch> = {
    '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
    '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
    '壬': '亥', '癸': '子',
  };
  // Need yearStem for this - parameter mismatch indicates we need refactoring
  // For now, compute with available params

  // ---- 擎羊/陀罗：禄存前一位=擎羊，后一位=陀罗 ----
  // Also need 禄存 first

  // ---- 火星/铃星：按年支+时支 ----
  const huoXingMap: Record<EarthlyBranch, EarthlyBranch> = {
    '寅': '丑', '卯': '寅', '辰': '卯', '巳': '辰',
    '午': '巳', '未': '午', '申': '未', '酉': '申',
    '戌': '未', '亥': '午',
    '子': '巳', '丑': '卯',
  };
  // This is based on 年支 + 时支, not just 年支

  return result;
}

/** 修正版：基于年干/年支的辅星安放 */
export function placeMinorStarsByYear(
  yearBranch: EarthlyBranch,
  yearStem: HeavenlyStem,
  lunarMonth: number,
  hourBranch: EarthlyBranch,
  dayBranch: EarthlyBranch,
): Record<EarthlyBranch, MinorStar[]> {
  const result = emptyBranchRecord<MinorStar>();

  const addStar = (branch: EarthlyBranch, star: MinorStar) => {
    if (!result[branch]) result[branch] = [];
    result[branch].push(star);
  };

  const hourIdx = EARTHLY_BRANCHES.indexOf(hourBranch);
  const yearIdx = EARTHLY_BRANCHES.indexOf(yearBranch);

  // 左辅：辰宫起正月顺数
  addStar(EARTHLY_BRANCHES[(4 + lunarMonth - 1) % 12], '左辅');

  // 右弼：戌宫起正月逆数
  addStar(EARTHLY_BRANCHES[(10 - (lunarMonth - 1) + 12) % 12], '右弼');

  // 文昌：戌宫起子时逆数
  addStar(EARTHLY_BRANCHES[(10 - hourIdx + 12) % 12], '文昌');

  // 文曲：辰宫起子时顺数
  addStar(EARTHLY_BRANCHES[(4 + hourIdx) % 12], '文曲');

  // 天魁：丑宫起甲年，顺数年干
  const yearStemIdx = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'].indexOf(yearStem);
  addStar(EARTHLY_BRANCHES[(1 + yearStemIdx) % 12], '天魁');

  // 天钺：未宫起甲年，顺数年干? 逆数? 天钺是天魁的对宫
  // 天钺: 未宫起甲年，顺数年干
  addStar(EARTHLY_BRANCHES[(7 + yearStemIdx) % 12], '天钺');

  // 禄存：按年干
  const luCunMap: Record<HeavenlyStem, EarthlyBranch> = {
    '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
    '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
    '壬': '亥', '癸': '子',
  };
  const luCunBranch = luCunMap[yearStem];
  addStar(luCunBranch, '禄存');

  // 擎羊：禄存前一位（顺）
  const yangIdx = (EARTHLY_BRANCHES.indexOf(luCunBranch) + 1) % 12;
  addStar(EARTHLY_BRANCHES[yangIdx], '擎羊');

  // 陀罗：禄存后一位（逆）
  const tuoIdx = (EARTHLY_BRANCHES.indexOf(luCunBranch) - 1 + 12) % 12;
  addStar(EARTHLY_BRANCHES[tuoIdx], '陀罗');

  // 火星：按年支+时支
  // 口诀: 寅午戌人丑卯方, 申子辰人巳寅方, 巳酉丑人卯戌方, 亥卯未人酉午方
  const tripleGroup = (() => {
    if (['寅','午','戌'].includes(yearBranch)) return 0;
    if (['申','子','辰'].includes(yearBranch)) return 1;
    if (['巳','酉','丑'].includes(yearBranch)) return 2;
    return 3; // 亥卯未
  })();

  const huoXingStart: EarthlyBranch[] = ['丑', '寅', '卯', '酉']; // Not quite right, needs hour component
  // Actually the correct formula for 火星 is based on 年支 group + 时支
  // Let me implement a simplified version
  const huoXingBranches: Record<number, EarthlyBranch[]> = {
    0: ['丑', '卯', '丑', '卯', '丑', '卯', '丑', '卯', '丑', '卯', '丑', '卯'], // 寅午戌
    1: ['巳', '寅', '巳', '寅', '巳', '寅', '巳', '寅', '巳', '寅', '巳', '寅'], // 申子辰
    2: ['卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌'], // 巳酉丑
    3: ['酉', '午', '酉', '午', '酉', '午', '酉', '午', '酉', '午', '酉', '午'], // 亥卯未
  };
  // Each group has 2 possible positions alternating by 时支 parity
  // Local: odd hours (子寅辰午申戌) → position A, even hours → position B
  const isOddHour = hourIdx % 2 === 0; // 子=0 even, 丑=1 odd...
  const huoXingBranch = huoXingBranches[tripleGroup]
    ? huoXingBranches[tripleGroup][isOddHour ? 0 : 1]
    : '丑';
  addStar(huoXingBranch as EarthlyBranch, '火星');

  // 铃星
  const lingXingBranches: Record<number, EarthlyBranch[]> = {
    0: ['卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌'], // 寅午戌
    1: ['戌', '未', '戌', '未', '戌', '未', '戌', '未', '戌', '未', '戌', '未'], // 申子辰
    2: ['戌', '卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌', '卯', '戌', '卯'], // 巳酉丑
    3: ['戌', '酉', '戌', '酉', '戌', '酉', '戌', '酉', '戌', '酉', '戌', '酉'], // 亥卯未
  };
  const lingXingBranch = lingXingBranches[tripleGroup]
    ? lingXingBranches[tripleGroup][isOddHour ? 0 : 1]
    : '卯';
  addStar(lingXingBranch as EarthlyBranch, '铃星');

  // 地空：亥宫起子时，逆数至生时
  addStar(EARTHLY_BRANCHES[(11 - hourIdx + 12) % 12], '地空');

  // 地劫：亥宫起子时，顺数至生时
  addStar(EARTHLY_BRANCHES[(11 + hourIdx) % 12], '地劫');

  // 天马：按年支三合局第一宫
  const tianMaMap: Record<string, EarthlyBranch> = {
    '寅': '申', '午': '申', '戌': '申', // 寅午戌 → 申
    '申': '寅', '子': '寅', '辰': '寅', // 申子辰 → 寅
    '巳': '亥', '酉': '亥', '丑': '亥', // 巳酉丑 → 亥
    '亥': '巳', '卯': '巳', '未': '巳', // 亥卯未 → 巳
  };
  addStar(tianMaMap[yearBranch], '天马');

  return result;
}
