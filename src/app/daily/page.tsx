'use client';
// 每日运势页 — 基于真实日干支 + 用户命盘的个性化运势
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ChartData, EarthlyBranch } from '@/engine/types';
import { EARTHLY_BRANCHES } from '@/engine/types';
import { getDayStemBranch } from '@/engine/calendar';
import { getSihuaByStem } from '@/engine/sihua';
import Link from 'next/link';

interface AspectScore {
  name: string;
  icon: string;
  score: number;
  label: string;
}

// 运势方面 → 对应宫位名
const ASPECT_PALACE: Record<string, string> = {
  '综合运势': '命宫',
  '财运': '财帛',
  '事业': '事业',
  '感情': '夫妻',
  '健康': '疾厄',
};

// 四化对宫位的影响权重
const SIHUA_WEIGHT: Record<string, number> = {
  '禄': 25,
  '权': 15,
  '科': 10,
  '忌': -20,
};

// 日支→幸运色映射
const BRANCH_COLORS: Record<string, { color: string; hex: string }> = {
  '子': { color: '深蓝', hex: '#1e3a5f' },
  '丑': { color: '棕黄', hex: '#8b7355' },
  '寅': { color: '翠绿', hex: '#2d8a4e' },
  '卯': { color: '嫩绿', hex: '#7ec850' },
  '辰': { color: '土黄', hex: '#c4a23a' },
  '巳': { color: '赤红', hex: '#c0392b' },
  '午': { color: '正红', hex: '#e74c3c' },
  '未': { color: '米黄', hex: '#d4c590' },
  '申': { color: '银白', hex: '#bdc3c7' },
  '酉': { color: '金色', hex: '#f39c12' },
  '戌': { color: '褐色', hex: '#8b6914' },
  '亥': { color: '藏青', hex: '#2c3e50' },
};

// 日支→速配生肖（六合）
const BRANCH_COMPATIBLE: Record<string, string> = {
  '子': '牛', '丑': '鼠', '寅': '猪', '亥': '虎',
  '卯': '狗', '戌': '兔', '辰': '鸡', '酉': '龙',
  '巳': '猴', '申': '蛇', '午': '羊', '未': '马',
};

/** 根据日干支 + 命盘计算运势指数 */
function calcDailyAspects(chart: ChartData, dayStem: string, dayBranch: string): AspectScore[] {
  const dailySihua = getSihuaByStem(dayStem as ChartData['lunarDate']['yearStem']);

  // 找出日四化每颗星落在用户命盘的哪个宫位
  const sihuaPalace: Record<string, { palace: string; sihua: string }> = {};
  for (const [sihua, star] of Object.entries(dailySihua)) {
    for (const branch of EARTHLY_BRANCHES) {
      const p = chart.palaces[branch];
      if (p.mainStars.includes(star as never)) {
        sihuaPalace[star as string] = { palace: p.name, sihua };
        break;
      }
    }
  }

  // 计算每个方面的得分
  return Object.entries(ASPECT_PALACE).map(([aspect, targetPalace]) => {
    let score = 55; // 基础分

    // 检查日四化是否触及该方面对应的宫位
    for (const [star, info] of Object.entries(sihuaPalace)) {
      if (info.palace === targetPalace) {
        score += SIHUA_WEIGHT[info.sihua] || 0;
      }
    }

    // 迁移宫影响感情（夫妻的对宫）
    if (aspect === '感情') {
      for (const [star, info] of Object.entries(sihuaPalace)) {
        if (info.palace === '迁移') {
          score += Math.floor((SIHUA_WEIGHT[info.sihua] || 0) * 0.5);
        }
      }
    }

    // 福德宫影响综合运势
    if (aspect === '综合运势') {
      for (const [star, info] of Object.entries(sihuaPalace)) {
        if (info.palace === '福德') {
          score += Math.floor((SIHUA_WEIGHT[info.sihua] || 0) * 0.5);
        }
      }
    }

    // 兄弟宫影响事业（交友的对宫是兄弟）
    if (aspect === '事业') {
      for (const [star, info] of Object.entries(sihuaPalace)) {
        if (info.palace === '交友') {
          score += Math.floor((SIHUA_WEIGHT[info.sihua] || 0) * 0.4);
        }
      }
    }

    // 限制在 5-95 之间
    score = Math.max(5, Math.min(95, score));

    let label: string;
    if (score >= 80) label = '大吉 · 顺风顺水';
    else if (score >= 65) label = '小吉 · 顺势而为';
    else if (score >= 45) label = '平稳 · 按部就班';
    else if (score >= 30) label = '小阻 · 多加留意';
    else label = '波折 · 谨言慎行';

    return { name: aspect, icon: getAspectIcon(aspect), score, label };
  });
}

function getAspectIcon(name: string): string {
  const map: Record<string, string> = {
    '综合运势': '🌟',
    '财运': '💰',
    '事业': '💼',
    '感情': '💕',
    '健康': '💪',
  };
  return map[name] || '📌';
}

export default function DailyPage() {
  const [chart, setChart] = useState<ChartData | null>(null);

  const today = useMemo(() => new Date(), []);
  const { stem: dayStem, branch: dayBranch } = useMemo(
    () => getDayStemBranch(today.getFullYear(), today.getMonth() + 1, today.getDate()),
    [today],
  );
  const dailySihua = useMemo(() => getSihuaByStem(dayStem), [dayStem]);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastChart');
    if (stored) {
      try { setChart(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // 基于命盘的真实运势指数
  const aspects = useMemo(
    () => chart ? calcDailyAspects(chart, dayStem, dayBranch) : [],
    [chart, dayStem, dayBranch],
  );

  // 幸运元素（基于日支，传统五行映射）
  const luckyColor = BRANCH_COLORS[dayBranch] || { color: '紫色', hex: '#8b5cf6' };
  const luckyAnimal = BRANCH_COMPATIBLE[dayBranch] || '鼠';

  // 日干支索引用于幸运数字
  const dayStemIdx = '甲乙丙丁戊己庚辛壬癸'.indexOf(dayStem);
  const dayBranchIdx = '子丑寅卯辰巳午未申酉戌亥'.indexOf(dayBranch);
  const luckyNums = [
    ((dayStemIdx + dayBranchIdx + 1) % 99) + 1,
    ((dayStemIdx * 7 + dayBranchIdx * 3 + 5) % 99) + 1,
    ((dayStemIdx * 3 + dayBranchIdx * 11 + 8) % 99) + 1,
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">今日运势</h1>
      <p className="text-center text-gray-500 mb-2">
        {today.getFullYear()}年{today.getMonth() + 1}月{today.getDate()}日
      </p>
      <p className="text-center text-sm text-purple-600 mb-8">
        {dayStem}{dayBranch}日 · 日四化：
        禄→<span className="text-green-600 font-medium">{dailySihua['禄']}</span>
        {' '}权→<span className="text-blue-600 font-medium">{dailySihua['权']}</span>
        {' '}科→<span className="text-purple-600 font-medium">{dailySihua['科']}</span>
        {' '}忌→<span className="text-red-500 font-medium">{dailySihua['忌']}</span>
      </p>

      {!chart && (
        <Card className="p-6 text-center mb-8">
          <div className="text-5xl mb-4">🔮</div>
          <p className="text-gray-700 font-medium mb-2">输入出生信息，获取个性化每日运势</p>
          <p className="text-gray-500 text-sm mb-4">
            系统会根据你的命盘，结合当天的日干支和四化，
            <br />为你精准推算各领域运势指数。
          </p>
          <Link href="/chart">
            <Button className="bg-purple-700 hover:bg-purple-800">去排盘 →</Button>
          </Link>
        </Card>
      )}

      {/* 运势指数 - 基于命盘 */}
      {aspects.length > 0 && (
        <div className="grid gap-3 mb-8">
          {aspects.map(a => (
            <Card key={a.name} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <span className="font-medium text-gray-800">{a.name}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{a.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-28 bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${
                        a.score >= 80 ? 'bg-green-500' :
                        a.score >= 65 ? 'bg-emerald-400' :
                        a.score >= 45 ? 'bg-yellow-400' :
                        a.score >= 30 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${a.score}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold w-8 text-right ${
                    a.score >= 65 ? 'text-green-600' :
                    a.score >= 45 ? 'text-yellow-600' : 'text-red-500'
                  }`}>
                    {a.score}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 今日幸运指南 — 基于日支传统五行 */}
      <Card className="p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-center">今日幸运指南</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">幸运色</p>
            <div className="flex items-center justify-center gap-1.5">
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: luckyColor.hex }}
              />
              <p className="text-base font-bold" style={{ color: luckyColor.hex }}>{luckyColor.color}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">幸运数字</p>
            <p className="text-base font-bold text-purple-700">{luckyNums.join(' · ')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">速配生肖</p>
            <p className="text-lg font-bold text-purple-700">{luckyAnimal}</p>
          </div>
        </div>
      </Card>

      {/* 今日一言 */}
      <Card className="p-6 text-center bg-gradient-to-r from-purple-50 to-indigo-50">
        <p className="text-lg text-purple-800 italic">
          "{[
            '顺应天时，顺势而为',
            '心静自然凉，心安万事安',
            '今天的努力，是明天的根基',
            '知人者智，自知者明',
            '好运藏在坚持里',
            '每一步都是必经之路',
            '心态决定命运',
          ][(dayStemIdx + dayBranchIdx) % 7]}"
        </p>
      </Card>
    </div>
  );
}
