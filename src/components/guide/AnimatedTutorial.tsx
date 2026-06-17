'use client';
// 动画教程组件 — 手机模拟器自动轮播演示
import { useState, useEffect, useCallback } from 'react';

interface Step {
  title: string;
  subtitle: string;
  screen: React.ReactNode;
}

const steps: Step[] = [
  {
    title: '1. 输入出生信息',
    subtitle: '填写公历出生年月日和时辰',
    screen: <BirthInputScreen />,
  },
  {
    title: '2. 查看命盘',
    subtitle: '生成完整的紫微斗数命盘',
    screen: <ChartScreen />,
  },
  {
    title: '3. AI 深度解读',
    subtitle: '选择解读类型，实时流式输出',
    screen: <ReadingScreen />,
  },
  {
    title: '4. 每日运势',
    subtitle: '结合命盘，每日个性化运势',
    screen: <DailyScreen />,
  },
  {
    title: '5. 合盘分析',
    subtitle: '双人命盘对比，缘分深度解读',
    screen: <CompatibilityScreen />,
  },
];

export default function AnimatedTutorial() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextStep = useCallback(() => {
    setStep(s => (s + 1) % steps.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextStep, 3500);
    return () => clearInterval(timer);
  }, [isPaused, nextStep]);

  const current = steps[step];

  return (
    <div
      className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 手机模型 */}
      <div className="relative shrink-0">
        {/* 手机外框 */}
        <div className="w-64 h-[460px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
          {/* 刘海 */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />
          {/* 屏幕 */}
          <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
            <div className="h-full flex flex-col">
              {/* 状态栏 */}
              <div className="bg-purple-700 text-white text-xs flex justify-between px-6 pt-7 pb-1">
                <span>9:41</span>
                <span>📶 🔋</span>
              </div>
              {/* 内容区 - 带动画切换 */}
              <div className="flex-1 overflow-hidden relative bg-purple-50">
                <div
                  key={step}
                  className="absolute inset-0 animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  {current.screen}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 底部导航模拟 */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* 文字说明 + 进度 */}
      <div className="text-center lg:text-left flex-1">
        <div className="text-sm text-purple-600 font-medium mb-1">
          步骤 {step + 1} / {steps.length}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{current.title}</h3>
        <p className="text-gray-500 mb-6">{current.subtitle}</p>

        {/* 进度点 */}
        <div className="flex gap-2 justify-center lg:justify-start mb-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => { setStep(i); setIsPaused(true); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === step
                  ? 'bg-purple-600 w-7'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400">
          💡 鼠标悬停暂停 · 点击圆点跳转
        </p>
      </div>
    </div>
  );
}

// ---- 各步骤屏幕内容 ----

function BirthInputScreen() {
  return (
    <div className="p-4 h-full flex flex-col justify-center">
      <div className="text-center mb-4">
        <p className="text-sm font-bold text-purple-800">输入出生信息 🔮</p>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg border border-purple-200 p-2 text-center">
            <p className="text-xs text-gray-400">年份</p>
            <p className="text-sm font-bold text-purple-700">1990</p>
          </div>
          <div className="bg-white rounded-lg border border-purple-200 p-2 text-center">
            <p className="text-xs text-gray-400">月份</p>
            <p className="text-sm font-bold text-purple-700">6</p>
          </div>
          <div className="bg-white rounded-lg border border-purple-200 p-2 text-center">
            <p className="text-xs text-gray-400">日期</p>
            <p className="text-sm font-bold text-purple-700">15</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-purple-200 p-2 flex justify-between items-center">
          <p className="text-xs text-gray-400">出生时间</p>
          <p className="text-sm font-bold text-purple-700">12:00 午时</p>
        </div>
        <div className="flex gap-2">
          <span className="flex-1 text-center py-1.5 bg-purple-100 border border-purple-400 rounded-lg text-xs font-medium text-purple-800">♂ 男</span>
          <span className="flex-1 text-center py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-500">♀ 女</span>
        </div>
      </div>
      <div className="mt-4 bg-purple-700 text-white text-center py-2.5 rounded-full text-sm font-medium animate-pulse">
        开始排盘 ✨
      </div>
    </div>
  );
}

function ChartScreen() {
  return (
    <div className="p-3 h-full flex flex-col">
      <p className="text-xs font-bold text-purple-800 text-center mb-2">你的紫微斗数命盘</p>
      {/* 简易命盘 SVG */}
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-auto max-h-56">
          {/* 外框 */}
          <rect x="10" y="10" width="180" height="180" rx="100" fill="none" stroke="#e9d5ff" strokeWidth="2" />
          {/* 十字线 */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="#e9d5ff" strokeWidth="1" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#e9d5ff" strokeWidth="1" />
          <line x1="36" y1="36" x2="164" y2="164" stroke="#e9d5ff" strokeWidth="1" />
          <line x1="164" y1="36" x2="36" y2="164" stroke="#e9d5ff" strokeWidth="1" />
          {/* 中心 */}
          <circle cx="100" cy="100" r="25" fill="#faf5ff" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="100" y="96" textAnchor="middle" fontSize="8" fill="#7c3aed" fontWeight="bold">紫微</text>
          <text x="100" y="108" textAnchor="middle" fontSize="6" fill="#a78bfa">天府</text>

          {/* 十二宫标注 */}
          <text x="100" y="32" textAnchor="middle" fontSize="6" fill="#6b7280">巳</text>
          <text x="155" y="50" textAnchor="middle" fontSize="6" fill="#6b7280">午</text>
          <text x="178" y="100" textAnchor="middle" fontSize="6" fill="#6b7280">未</text>
          <text x="155" y="150" textAnchor="middle" fontSize="6" fill="#6b7280">申</text>
          <text x="100" y="178" textAnchor="middle" fontSize="6" fill="#6b7280">酉</text>
          <text x="45" y="150" textAnchor="middle" fontSize="6" fill="#6b7280">戌</text>
          <text x="22" y="100" textAnchor="middle" fontSize="6" fill="#6b7280">亥</text>
          <text x="45" y="50" textAnchor="middle" fontSize="6" fill="#6b7280">子</text>
          <text x="100" y="55" textAnchor="middle" fontSize="6" fill="#f59e0b">寅·命宫</text>
          <text x="55" y="120" textAnchor="middle" fontSize="6" fill="#6b7280">丑</text>
          <text x="145" y="120" textAnchor="middle" fontSize="6" fill="#6b7280">辰</text>

          {/* 星曜装饰点 */}
          <circle cx="130" cy="60" r="2.5" fill="#8b5cf6" />
          <circle cx="135" cy="55" r="1.5" fill="#f59e0b" />
          <circle cx="70" cy="65" r="2" fill="#ec4899" />
          <circle cx="125" cy="140" r="2" fill="#3b82f6" />
          <circle cx="60" cy="80" r="1.5" fill="#10b981" />
          <circle cx="140" cy="85" r="1.5" fill="#ef4444" />
        </svg>
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">
        命宫在寅 · 土五局 · 四化齐全
      </p>
      <div className="mt-2 bg-purple-700 text-white text-center py-2 rounded-full text-xs">
        查看详细解读 →
      </div>
    </div>
  );
}

function ReadingScreen() {
  return (
    <div className="p-4 h-full flex flex-col">
      <p className="text-xs font-bold text-purple-800 text-center mb-3">AI 命理解读</p>
      {/* 读取类型按钮 */}
      <div className="text-xs text-gray-600 mb-2 text-center">解读类型：本命盘</div>
      {/* 解读内容模拟 */}
      <div className="flex-1 bg-white rounded-xl p-3 border border-purple-100">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center text-[8px]">🧘</div>
          <span className="text-[10px] font-medium text-purple-700">紫微君</span>
        </div>
        <div className="space-y-1.5">
          <p className="text-[9px] text-gray-700 leading-relaxed">
            🔮 命宫有<strong>紫微</strong>坐守，你天生带有一种不凡的气质...
          </p>
          <p className="text-[9px] text-gray-700 leading-relaxed">
            💪 紫微是帝星，代表领导力和格局...
          </p>
          <p className="text-[9px] text-gray-700 leading-relaxed">
            ✨ 辅星天府相伴，意味着你不仅有魄力...
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-3 bg-purple-500 animate-pulse rounded-sm" />
            <span className="text-[9px] text-gray-400">AI 正在生成...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyScreen() {
  return (
    <div className="p-4 h-full flex flex-col">
      <p className="text-xs font-bold text-purple-800 text-center mb-2">今日运势</p>
      <p className="text-[10px] text-gray-500 text-center mb-3">2026年6月16日 · 辛酉日</p>

      <div className="space-y-2 flex-1">
        {[
          { icon: '🌟', name: '综合', score: 78, color: 'bg-green-500' },
          { icon: '💰', name: '财运', score: 62, color: 'bg-emerald-400' },
          { icon: '💼', name: '事业', score: 85, color: 'bg-green-500' },
          { icon: '💕', name: '感情', score: 45, color: 'bg-yellow-400' },
        ].map(item => (
          <div key={item.name} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100">
            <span className="text-xs">{item.icon}</span>
            <span className="text-[10px] text-gray-700 w-8">{item.name}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
            </div>
            <span className="text-[10px] font-bold text-gray-700 w-6 text-right">{item.score}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-2 text-center">
        <p className="text-[9px] text-purple-700 italic">
          &quot;今天的努力，是明天的根基&quot;
        </p>
      </div>
    </div>
  );
}

function CompatibilityScreen() {
  return (
    <div className="p-4 h-full flex flex-col">
      <p className="text-xs font-bold text-purple-800 text-center mb-2">合盘分析 💑</p>
      <p className="text-[10px] text-gray-500 text-center mb-2">两人命盘深度对比</p>

      {/* 双人卡片 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-xl border border-pink-200 p-2 text-center">
          <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-1">
            <span className="text-xs">♐</span>
          </div>
          <p className="text-[9px] font-bold text-gray-800">本人</p>
          <p className="text-[7px] text-gray-400">1990-06-15</p>
          <p className="text-[7px] text-purple-600">命宫寅 · 火六局</p>
          <div className="flex gap-0.5 justify-center mt-1">
            <span className="text-[6px] bg-purple-50 text-purple-600 px-1 rounded">紫微</span>
            <span className="text-[6px] bg-pink-50 text-pink-600 px-1 rounded">天府</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-2 text-center">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
            <span className="text-xs">♉</span>
          </div>
          <p className="text-[9px] font-bold text-gray-800">对方</p>
          <p className="text-[7px] text-gray-400">1992-03-20</p>
          <p className="text-[7px] text-purple-600">命宫申 · 土五局</p>
          <div className="flex gap-0.5 justify-center mt-1">
            <span className="text-[6px] bg-blue-50 text-blue-600 px-1 rounded">天相</span>
            <span className="text-[6px] bg-cyan-50 text-cyan-600 px-1 rounded">天机</span>
          </div>
        </div>
      </div>

      {/* 维度评分 */}
      <div className="space-y-1.5 flex-1">
        {[
          { icon: '🧠', label: '性格契合', score: 72 },
          { icon: '💞', label: '感情模式', score: 85 },
          { icon: '⚡', label: '优势互补', score: 66 },
          { icon: '🤝', label: '相处建议', score: 79 },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 bg-white rounded-lg p-1.5 border border-gray-100">
            <span className="text-[10px]">{item.icon}</span>
            <span className="text-[9px] text-gray-700 flex-1">{item.label}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div
                className="h-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
                style={{ width: `${item.score}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-gray-700">{item.score}%</span>
          </div>
        ))}
      </div>

      <p className="text-center text-[8px] text-gray-400 mt-2">
        AI 从四维度综合分析两人关系
      </p>
    </div>
  );
}
