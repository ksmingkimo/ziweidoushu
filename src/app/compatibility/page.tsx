'use client';
// 合盘页 — 双人命盘适配分析
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateChart } from '@/engine/chart';
import type { ChartData, Gender } from '@/engine/types';
import { EARTHLY_BRANCHES } from '@/engine/types';
import Link from 'next/link';

type StreamEvent = { text?: string; done?: boolean; error?: string };

export default function CompatibilityPage() {
  // Person A
  const [aYear, setAYear] = useState('1990');
  const [aMonth, setAMonth] = useState('6');
  const [aDay, setADay] = useState('15');
  const [aHour, setAHour] = useState('12');
  const [aGender, setAGender] = useState<Gender>('男');
  const [aChart, setAChart] = useState<ChartData | null>(null);

  // Person B
  const [bYear, setBYear] = useState('1992');
  const [bMonth, setBMonth] = useState('8');
  const [bDay, setBDay] = useState('20');
  const [bHour, setBHour] = useState('14');
  const [bGender, setBGender] = useState<Gender>('女');
  const [bChart, setBChart] = useState<ChartData | null>(null);

  // Reading state
  const [reading, setReading] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const readingRef = useRef<HTMLDivElement>(null);

  // Auto-fill Person A from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('lastChart');
    if (stored) {
      try {
        const chart = JSON.parse(stored) as ChartData;
        setAChart(chart);
        // 尝试从 solarDate 反解（简单提取年份）
        const match = chart.solarDate.match(/(\d{4})/);
        if (match) setAYear(match[1]);
        setAGender(chart.gender);
      } catch { /* ignore */ }
    }
  }, []);

  const handleCalcA = () => {
    setError('');
    try {
      const chart = calculateChart(Number(aYear), Number(aMonth), Number(aDay), Number(aHour), aGender);
      setAChart(chart);
    } catch {
      setError('甲方排盘失败，请检查输入');
    }
  };

  const handleCalcB = () => {
    setError('');
    try {
      const chart = calculateChart(Number(bYear), Number(bMonth), Number(bDay), Number(bHour), bGender);
      setBChart(chart);
    } catch {
      setError('乙方排盘失败，请检查输入');
    }
  };

  const handleStartReading = async () => {
    if (!aChart || !bChart) return;
    setStreaming(true);
    setReading('');
    setError('');

    try {
      const response = await fetch('/api/reading/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartData: aChart,
          readingType: 'compatibility',
          focusAreas: [],
          partnerChart: bChart,
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
              if (data.error) {
                setReading(prev => prev + `\n\n❌ ${data.error}`);
                setStreaming(false);
              }
            } catch { /* ignore */ }
          }
        }
      }
    } catch {
      setReading(prev => prev + `\n\n❌ 解读服务暂时不可用`);
      setStreaming(false);
    }
  };

  const bothReady = aChart && bChart;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">💑 合盘分析</h1>
      <p className="text-center text-gray-500 mb-8">
        输入两人的出生信息，AI 分析性格契合度和关系走势
      </p>

      {/* 两人输入区 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Person A */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
            <span className="text-purple-700">👤</span> 本人
            {aChart && <span className="text-xs text-green-500 font-normal">✓ 已排盘</span>}
          </h2>
          <BirthForm
            year={aYear} month={aMonth} day={aDay} hour={aHour} gender={aGender}
            onYear={setAYear} onMonth={setAMonth} onDay={setADay} onHour={setAHour} onGender={setAGender}
          />
          <Button onClick={handleCalcA} className="w-full mt-3 bg-purple-700 hover:bg-purple-800" size="sm">
            {aChart ? '重新排盘' : '计算命盘'}
          </Button>
          {aChart && (
            <div className="mt-3 text-xs text-gray-500 text-center">
              命宫<span className="font-bold text-purple-700">{aChart.mingPalace}</span>
              {' · '}{aChart.elementBureau}
              {' · '}{aChart.palaces[aChart.mingPalace].mainStars.join('、') || '无主星'}
              {' · '}夫妻宫：{getPalaceStars(aChart, '夫妻')}
            </div>
          )}
        </Card>

        {/* Person B */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
            <span className="text-pink-600">👤</span> 对方
            {bChart && <span className="text-xs text-green-500 font-normal">✓ 已排盘</span>}
          </h2>
          <BirthForm
            year={bYear} month={bMonth} day={bDay} hour={bHour} gender={bGender}
            onYear={setBYear} onMonth={setBMonth} onDay={setBDay} onHour={setBHour} onGender={setBGender}
          />
          <Button onClick={handleCalcB} className="w-full mt-3 bg-pink-600 hover:bg-pink-700" size="sm">
            {bChart ? '重新排盘' : '计算命盘'}
          </Button>
          {bChart && (
            <div className="mt-3 text-xs text-gray-500 text-center">
              命宫<span className="font-bold text-pink-600">{bChart.mingPalace}</span>
              {' · '}{bChart.elementBureau}
              {' · '}{bChart.palaces[bChart.mingPalace].mainStars.join('、') || '无主星'}
              {' · '}夫妻宫：{getPalaceStars(bChart, '夫妻')}
            </div>
          )}
        </Card>
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {/* 解读区域 */}
      {bothReady && !reading && !streaming && (
        <div className="text-center mb-8">
          <Button onClick={handleStartReading} className="bg-purple-700 hover:bg-purple-800 text-lg px-10 py-6">
            🔮 AI 合盘解读
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            综合分析两人的性格契合度、感情模式和相处建议
          </p>
        </div>
      )}

      {/* 解读内容 */}
      {(reading || streaming) && (
        <Card className="p-6 max-w-3xl mx-auto">
          <h3 className="font-bold text-gray-800 mb-4 text-center">💑 合盘解读结果</h3>
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
          {!streaming && reading && (
            <div className="text-center mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setReading('')}>
                重新解读
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* 空状态引导 */}
      {!bothReady && (
        <Card className="p-8 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-4">💑</div>
          <p className="text-gray-500 mb-4">
            分别输入两人出生信息并排盘，
            <br />然后 AI 将为你们分析适配度
          </p>
          <p className="text-xs text-gray-400">
            💡 本人信息会自动从上次排盘读取
          </p>
        </Card>
      )}
    </div>
  );
}

// ---- 子组件 ----

function BirthForm({
  year, month, day, hour, gender,
  onYear, onMonth, onDay, onHour, onGender,
}: {
  year: string; month: string; day: string; hour: string; gender: Gender;
  onYear: (v: string) => void;
  onMonth: (v: string) => void;
  onDay: (v: string) => void;
  onHour: (v: string) => void;
  onGender: (v: Gender) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">年份</Label>
          <Input type="number" value={year} onChange={e => onYear(e.target.value)}
            min="1900" max="2100" className="h-9 text-sm" />
        </div>
        <div>
          <Label className="text-xs">月份</Label>
          <Input type="number" value={month} onChange={e => onMonth(e.target.value)}
            min="1" max="12" className="h-9 text-sm" />
        </div>
        <div>
          <Label className="text-xs">日期</Label>
          <Input type="number" value={day} onChange={e => onDay(e.target.value)}
            min="1" max="31" className="h-9 text-sm" />
        </div>
      </div>
      <div>
        <Label className="text-xs">出生时间（24小时制）</Label>
        <div className="flex items-center gap-2">
          <Input type="number" value={hour} onChange={e => onHour(e.target.value)}
            min="0" max="23" className="h-9 text-sm w-20" />
          <span className="text-xs text-gray-500 mr-2">时</span>
          {hour !== '' && (
            <span className="text-xs text-purple-600">
              {EARTHLY_BRANCHES[Math.floor(((Number(hour || '0') + 1) % 24) / 2)]}时
            </span>
          )}
        </div>
      </div>
      <div>
        <Label className="text-xs">性别</Label>
        <div className="flex gap-2 mt-1">
          {(['男', '女'] as Gender[]).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => onGender(g)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                gender === g
                  ? 'bg-purple-100 border-purple-400 text-purple-800'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {g === '男' ? '♂ 男' : '♀ 女'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getPalaceStars(chart: ChartData, palaceName: string): string {
  const branches = Object.keys(chart.palaces);
  for (const b of branches) {
    if (chart.palaces[b as keyof typeof chart.palaces].name === palaceName) {
      return chart.palaces[b as keyof typeof chart.palaces].mainStars.join('、') || '无主星';
    }
  }
  return '未知';
}
