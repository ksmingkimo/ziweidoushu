'use client';
// 命盘查看页 - 完整交互式显示
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ChartData, EarthlyBranch } from '@/engine/types';
import { ZiweiPanFull } from '@/components/chart/ZiweiPan';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ChartViewPage() {
  const router = useRouter();
  const [chart, setChart] = useState<ChartData | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<EarthlyBranch | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastChart');
    if (stored) {
      try {
        setChart(JSON.parse(stored) as ChartData);
      } catch {
        router.push('/chart');
      }
    } else {
      router.push('/chart');
    }
  }, [router]);

  if (!chart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">请先输入出生信息</p>
        <Link href="/chart" className="text-purple-600 hover:underline mt-2 inline-block">
          返回排盘 →
        </Link>
      </div>
    );
  }

  const selectedPalace = selectedBranch ? chart.palaces[selectedBranch] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">你的紫微斗数命盘</h1>
      <p className="text-center text-gray-500 mb-6">
        {chart.solarDate} · 命宫在{chart.mingPalace} · {chart.elementBureau}
        {chart.patterns.length > 0 && ` · 格局：${chart.patterns.join('、')}`}
      </p>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* 命盘 SVG */}
        <Card className="p-4">
          <ZiweiPanFull
            chart={chart}
            interactive
            selectedBranch={selectedBranch}
            onPalaceClick={setSelectedBranch}
          />
        </Card>

        {/* 宫位详情 */}
        <div>
          {selectedPalace ? (
            <Card className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-3">
                {selectedPalace.name}（{selectedBranch}宫）
                {selectedPalace.bodyPalace && <span className="text-purple-600 text-sm ml-1">[身宫]</span>}
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>主星：</strong>{selectedPalace.mainStars.join('、') || '无'}</p>
                <p><strong>辅星：</strong>{selectedPalace.minorStars.join('、') || '无'}</p>
                {selectedPalace.sihua && (
                  <p><strong>四化：</strong>
                    <span className="font-bold text-purple-600">{selectedPalace.sihua}</span>
                  </p>
                )}
                <p><strong>大限：</strong>{selectedPalace.daxianAgeStart}-{selectedPalace.daxianAgeEnd}岁</p>
              </div>

              <Button
                onClick={() => router.push(`/reading?palace=${selectedPalace.name}`)}
                className="w-full mt-4 bg-purple-700 hover:bg-purple-800"
              >
                解读{selectedPalace.name} →
              </Button>
            </Card>
          ) : (
            <Card className="p-4 text-center text-gray-400">
              <p className="text-sm">点击命盘中的宫位</p>
              <p className="text-sm">查看详细星曜信息</p>
            </Card>
          )}

          {/* 解读入口 */}
          <div className="mt-4 space-y-2">
            <Link href="/reading?type=natal">
              <Button className="w-full bg-purple-700 hover:bg-purple-800">
                🔮 本命盘解读
              </Button>
            </Link>
            <Link href="/reading?type=liunian">
              <Button variant="outline" className="w-full">
                📅 流年运势
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
