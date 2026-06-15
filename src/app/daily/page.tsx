'use client';
// 每日运势页
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ChartData } from '@/engine/types';
import { getYearStemBranch } from '@/engine/liunian';
import { getSihuaByStem } from '@/engine/sihua';
import Link from 'next/link';

export default function DailyPage() {
  const [chart, setChart] = useState<ChartData | null>(null);
  const today = new Date();
  const { stem, branch } = getYearStemBranch(today.getFullYear());
  const dailySihua = getSihuaByStem(stem);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastChart');
    if (stored) {
      try { setChart(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // 根据日期生成伪随机运势指数
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const pseudoRandom = (seed: number, offset: number) => {
    const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
    return Math.floor((x - Math.floor(x)) * 100);
  };

  const aspects = [
    { name: '综合运势', icon: '🌟', score: pseudoRandom(daySeed, 0) },
    { name: '财运', icon: '💰', score: pseudoRandom(daySeed, 1) },
    { name: '事业', icon: '💼', score: pseudoRandom(daySeed, 2) },
    { name: '感情', icon: '💕', score: pseudoRandom(daySeed, 3) },
    { name: '健康', icon: '💪', score: pseudoRandom(daySeed, 4) },
  ];

  const luckyColors = ['紫色', '金色', '蓝色', '绿色', '红色', '白色', '黄色', '橙色'];
  const luckyNumbers = Array.from({length: 3}, (_, i) => pseudoRandom(daySeed, i + 10) % 100);
  const luckyColor = luckyColors[pseudoRandom(daySeed, 20) % luckyColors.length];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">今日运势</h1>
      <p className="text-center text-gray-500 mb-2">
        {today.getFullYear()}年{today.getMonth() + 1}月{today.getDate()}日
      </p>
      <p className="text-center text-sm text-purple-600 mb-8">
        {stem}{branch}年 · 日四化：禄→{dailySihua['禄']} 权→{dailySihua['权']} 科→{dailySihua['科']} 忌→{dailySihua['忌']}
      </p>

      {!chart && (
        <Card className="p-6 text-center mb-8">
          <p className="text-gray-500 mb-4">输入出生信息，获取个性化每日运势</p>
          <Link href="/chart">
            <Button className="bg-purple-700 hover:bg-purple-800">去排盘 →</Button>
          </Link>
        </Card>
      )}

      {/* 运势指数 */}
      <div className="grid gap-4 mb-8">
        {aspects.map(a => (
          <Card key={a.name} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{a.icon}</span>
                <span className="font-medium text-gray-800">{a.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      a.score > 70 ? 'bg-green-500' : a.score > 40 ? 'bg-yellow-500' : 'bg-red-400'
                    }`}
                    style={{ width: `${a.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">
                  {a.score}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 幸运数字/颜色 */}
      <Card className="p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-center">今日幸运指南</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">幸运色</p>
            <p className="text-lg font-bold text-purple-700">{luckyColor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">幸运数字</p>
            <p className="text-lg font-bold text-purple-700">{luckyNumbers.join(' · ')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">速配生肖</p>
            <p className="text-lg font-bold text-purple-700">
              {['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'][pseudoRandom(daySeed, 30) % 12]}
            </p>
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
          ][pseudoRandom(daySeed, 100) % 7]}"
        </p>
      </Card>
    </div>
  );
}
