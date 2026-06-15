'use client';
// 排盘输入页
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateChart } from '@/engine/chart';
import type { Gender, ChartData } from '@/engine/types';
import { EARTHLY_BRANCHES } from '@/engine/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ZiweiPanMini } from '@/components/chart/ZiweiPan';

export default function ChartPage() {
  const router = useRouter();
  const [year, setYear] = useState('1990');
  const [month, setMonth] = useState('6');
  const [day, setDay] = useState('15');
  const [hour, setHour] = useState('12');
  const [gender, setGender] = useState<Gender>('男');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setError('');
    setLoading(true);
    try {
      const y = parseInt(year);
      const m = parseInt(month);
      const d = parseInt(day);
      const h = parseInt(hour);

      if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
        setError('请输入有效的出生日期');
        setLoading(false);
        return;
      }

      // 前端直接计算（引擎是纯函数，无需调 API）
      const chart = calculateChart(y, m, d, h, gender);
      setChartData(chart);

      // 可以保存到本地，后续跳转时携带
      sessionStorage.setItem('lastChart', JSON.stringify(chart));
    } catch (e) {
      setError('排盘计算失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        输入出生信息，解密你的命盘 🔮
      </h1>

      <Card className="p-6 max-w-md mx-auto mb-8">
        {/* 日期 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <Label htmlFor="year">年份</Label>
            <Input id="year" type="number" value={year} onChange={e => setYear(e.target.value)}
              min="1900" max="2100" placeholder="1990" />
          </div>
          <div>
            <Label htmlFor="month">月份</Label>
            <Input id="month" type="number" value={month} onChange={e => setMonth(e.target.value)}
              min="1" max="12" placeholder="6" />
          </div>
          <div>
            <Label htmlFor="day">日期</Label>
            <Input id="day" type="number" value={day} onChange={e => setDay(e.target.value)}
              min="1" max="31" placeholder="15" />
          </div>
        </div>

        {/* 时间 */}
        <div className="mb-4">
          <Label>出生时间（24小时制）</Label>
          <div className="flex gap-3 items-center mt-1">
            <Input type="number" value={hour} onChange={e => setHour(e.target.value)}
              min="0" max="23" className="w-24" />
            <span className="text-sm text-gray-500">时（0-23）</span>
            {hour !== '' && (
              <span className="text-sm text-purple-600 font-medium">
                {EARTHLY_BRANCHES[Math.floor(((parseInt(hour || '0') + 1) % 24) / 2)]}时
              </span>
            )}
          </div>
        </div>

        {/* 性别 */}
        <div className="mb-6">
          <Label>性别</Label>
          <div className="flex gap-2 mt-1">
            {(['男', '女'] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
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

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <Button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800"
        >
          {loading ? '计算中...' : '开始排盘 ✨'}
        </Button>
      </Card>

      {/* 命盘展示 */}
      {chartData && (
        <div className="animate-in fade-in duration-500">
          <ZiweiPanMini chart={chartData} />
          <div className="text-center mt-6">
            <Button
              onClick={() => {
                sessionStorage.setItem('lastChart', JSON.stringify(chartData));
                router.push(`/chart/view`);
              }}
              className="bg-purple-700 hover:bg-purple-800"
            >
              查看详细解读 →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
