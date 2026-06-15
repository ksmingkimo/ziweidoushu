'use client';
// AI 解读页 - 核心变现页面
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ChartData } from '@/engine/types';
import Link from 'next/link';

const READING_TYPES = [
  { id: 'natal', label: '🔮 本命盘', desc: '性格·天赋·格局', price: 1 },
  { id: 'palace_ming', label: '🏠 命宫详解', desc: '核心自我', price: 1 },
  { id: 'palace_fuq', label: '💑 夫妻宫', desc: '感情婚姻', price: 1 },
  { id: 'palace_caibo', label: '💰 财帛宫', desc: '财运分析', price: 1 },
  { id: 'palace_shiye', label: '💼 事业宫', desc: '职业发展', price: 1 },
  { id: 'daxian', label: '📊 大限运势', desc: '十年大运', price: 1 },
  { id: 'liunian', label: '📅 流年运势', desc: '年度运势', price: 1 },
  { id: 'liuyue', label: '🌙 流月运势', desc: '月度运势', price: 1 },
];

type StreamEvent = { text?: string; done?: boolean; error?: string; cached?: boolean };

function ReadingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chart, setChart] = useState<ChartData | null>(null);
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'natal');
  const [reading, setReading] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const readingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastChart');
    if (stored) {
      try { setChart(JSON.parse(stored)); } catch { router.push('/chart'); }
    } else {
      router.push('/chart');
    }
  }, [router]);

  const handleStartReading = async () => {
    if (!chart) return;

    // 检查是否需要付费（模拟：每用户有3次免费）
    const usedFree = parseInt(sessionStorage.getItem('freeReadings') || '0');
    if (usedFree >= 3) {
      setShowPayment(true);
      return;
    }

    setStreaming(true);
    setReading('');
    sessionStorage.setItem('freeReadings', String(usedFree + 1));

    try {
      const response = await fetch('/api/reading/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartData: chart,
          readingType: selectedType,
          focusAreas: [],
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamEvent = JSON.parse(line.slice(6));
              if (data.text) setReading(prev => prev + data.text);
              if (data.done) setStreaming(false);
              if (data.error) { setReading(prev => prev + `\n\n❌ ${data.error}`); setStreaming(false); }
            } catch { /* ignore parse errors */ }
          }
        }
      }
    } catch (error) {
      setReading(prev => prev + `\n\n❌ 解读服务暂时不可用，请稍后重试`);
      setStreaming(false);
    }
  };

  const handlePayAndRead = () => {
    sessionStorage.setItem('pendingReading', JSON.stringify({
      type: selectedType,
      chartData: chart,
    }));
    router.push('/payment');
  };

  if (!chart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">请先生成命盘</p>
        <Link href="/chart" className="text-purple-600 hover:underline mt-2 inline-block">返回排盘 →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">AI 命理解读</h1>

      {/* 命盘摘要 */}
      <Card className="p-4 mb-6 text-center">
        <p className="text-sm text-gray-500">
          命宫在<span className="text-purple-700 font-bold">{chart.mingPalace}</span>
          {' · '}{chart.elementBureau}
          {' · '}主星：{chart.palaces[chart.mingPalace].mainStars.join('、') || '无'}
        </p>
      </Card>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* 解读类型选择 */}
        <div className="space-y-2">
          {READING_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedType(t.id); setReading(''); }}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedType === t.id
                  ? 'border-purple-400 bg-purple-50 text-purple-800'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="font-medium text-sm">{t.label}</div>
              <div className="text-xs text-gray-400">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* 解读内容 */}
        <div>
          <Card className="p-6 min-h-[400px]">
            {showPayment ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">免费次数已用完</h3>
                <p className="text-gray-500 mb-6">每次解读 ¥29.99，购买套餐更优惠</p>
                <Button onClick={handlePayAndRead} className="bg-purple-700 hover:bg-purple-800">
                  购买次数 →
                </Button>
              </div>
            ) : !reading && !streaming ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🧘</div>
                <p className="text-gray-500 mb-6">
                  选择左侧解读类型，AI 紫微君为你深度解读
                </p>
                <Button onClick={handleStartReading} className="bg-purple-700 hover:bg-purple-800">
                  开始 AI 解读 ✨
                </Button>
                <p className="text-xs text-gray-400 mt-3">
                  剩余免费次数：{3 - parseInt(sessionStorage.getItem('freeReadings') || '0')} 次
                </p>
              </div>
            ) : (
              <div>
                <div className="prose prose-sm max-w-none" ref={readingRef}>
                  {reading.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 text-gray-700 leading-relaxed">
                      {line || ' '}
                    </p>
                  ))}
                </div>
                {streaming && (
                  <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1" />
                )}
              </div>
            )}
          </Card>

          {reading && !streaming && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => { setReading(''); setSelectedType('natal'); }}>
                解读其他方面
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    }>
      <ReadingPageContent />
    </Suspense>
  );
}
