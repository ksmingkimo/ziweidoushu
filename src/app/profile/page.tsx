'use client';
// 个人中心
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ChartData } from '@/engine/types';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  date: string;
  type: string;
  typeLabel: string;
  chartInfo: string;
  preview: string;
  content: string;
}

export default function ProfilePage() {
  const [chart, setChart] = useState<ChartData | null>(null);
  const [readings, setReadings] = useState<HistoryItem[]>([]);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastChart');
    if (stored) {
      try { setChart(JSON.parse(stored)); } catch { /* ignore */ }
    }

    // 模拟历史记录
    const savedReadings = sessionStorage.getItem('readingHistory');
    if (savedReadings) {
      try { setReadings(JSON.parse(savedReadings)); } catch { /* ignore */ }
    }

    const usedFree = parseInt(sessionStorage.getItem('freeReadings') || '0');
    setCredits(Math.max(0, 3 - usedFree));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">个人中心</h1>

      {/* 用户信息卡片 */}
      <Card className="p-6 mb-6 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🧘</span>
        </div>
        <h2 className="font-bold text-gray-800">
          {chart ? `${chart.lunarDate.yearStem}${chart.lunarDate.yearBranch}年生·${chart.gender}` : '未设置命盘'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {chart
            ? `命宫在${chart.mingPalace} · ${chart.elementBureau}`
            : '输入出生信息开始探索'}
        </p>
        {!chart && (
          <Link href="/chart">
            <Button className="mt-3 bg-purple-700 hover:bg-purple-800" size="sm">去排盘 →</Button>
          </Link>
        )}
      </Card>

      {/* 剩余次数 */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">解读次数</p>
            <p className="text-sm text-gray-500">剩余可用次数</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-purple-700">{credits}</span>
            <span className="text-gray-400 text-sm ml-1">次</span>
          </div>
        </div>
        <Link href="/payment">
          <Button variant="outline" className="w-full mt-3">购买更多次数 →</Button>
        </Link>
      </Card>

      {/* 解读历史 */}
      <h3 className="font-bold text-gray-800 mb-3">解读历史</h3>
      {readings.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-400">暂无解读记录</p>
          <Link href="/reading">
            <Button className="mt-3 bg-purple-700 hover:bg-purple-800" size="sm">开始第一次解读 →</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {readings.map((item, i) => (
            <Card key={i} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{item.typeLabel}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.preview.slice(0, 80)}...</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.date}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
