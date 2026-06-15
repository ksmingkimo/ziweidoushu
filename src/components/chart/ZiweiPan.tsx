'use client';
// 紫微斗数命盘 SVG 可视化组件
import type { ChartData, EarthlyBranch, PalaceData } from '@/engine/types';
import { EARTHLY_BRANCHES } from '@/engine/types';

interface Props {
  chart: ChartData;
  interactive?: boolean;
  onPalaceClick?: (branch: EarthlyBranch) => void;
  selectedBranch?: EarthlyBranch | null;
  mini?: boolean;
}

/** 简化版命盘（用于输入页快速预览） */
export function ZiweiPanMini({ chart }: { chart: ChartData }) {
  return (
    <div className="text-center p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">命盘已生成</h3>
      <p className="text-gray-600">
        命宫在 <strong className="text-purple-700">{chart.mingPalace}</strong>
        {' '}·{' '}
        {chart.elementBureau}
        {' '}·{' '}
        主星：{chart.palaces[chart.mingPalace].mainStars.join('、')}
      </p>
      {chart.patterns.length > 0 && (
        <p className="text-orange-600 text-sm mt-1">格局：{chart.patterns.join('、')}</p>
      )}
    </div>
  );
}

/** 宫位颜色 */
const PALACE_COLORS: Record<string, { bg: string; border: string }> = {
  '命宫': { bg: '#fef3c7', border: '#f59e0b' },
  '夫妻': { bg: '#fce7f3', border: '#ec4899' },
  '财帛': { bg: '#d1fae5', border: '#10b981' },
  '事业': { bg: '#dbeafe', border: '#3b82f6' },
  '福德': { bg: '#ede9fe', border: '#8b5cf6' },
  '迁移': { bg: '#e0e7ff', border: '#6366f1' },
};

/** 四化颜色 */
const SIHUA_COLORS: Record<string, string> = {
  '禄': '#10b981',
  '权': '#3b82f6',
  '科': '#8b5cf6',
  '忌': '#ef4444',
};

/** 完整交互式命盘 */
export function ZiweiPanFull({ chart, interactive, onPalaceClick, selectedBranch }: Props) {
  const size = 600;
  const center = size / 2;
  const radius = center - 40;
  const innerRadius = radius * 0.45;

  // 将地支映射到角度(顺时针，子=270°)
  const branchAngle = (branch: EarthlyBranch): number => {
    const idx = EARTHLY_BRANCHES.indexOf(branch);
    // 子在顶部(270°), 逆时针排列
    return ((270 + idx * 30) % 360) * (Math.PI / 180);
  };

  const getPos = (branch: EarthlyBranch, r: number) => {
    const a = branchAngle(branch);
    return {
      x: center + r * Math.cos(a),
      y: center - r * Math.sin(a),
    };
  };

  return (
    <div className="flex justify-center overflow-x-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[600px]">
        {/* 背景 */}
        <rect width={size} height={size} fill="#faf5ff" rx="12" />

        {/* 十二宫分界线 */}
        {EARTHLY_BRANCHES.map((b, i) => {
          const a = branchAngle(b);
          const x1 = center + innerRadius * Math.cos(a);
          const y1 = center - innerRadius * Math.sin(a);
          const x2 = center + radius * Math.cos(a);
          const y2 = center - radius * Math.sin(a);
          return (
            <line key={`line-${b}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#d4c5e2" strokeWidth="1" />
          );
        })}

        {/* 内圈 */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#7c3aed" strokeWidth="2" />
        <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="#7c3aed" strokeWidth="1.5" />

        {/* 宫位 */}
        {EARTHLY_BRANCHES.map((b) => {
          const palace = chart.palaces[b];
          const pos = getPos(b, (radius + innerRadius) / 2);
          const colors = PALACE_COLORS[palace.name] || { bg: '#ffffff', border: '#e5e7eb' };
          const isSelected = selectedBranch === b;

          return (
            <g key={b}
              onClick={() => interactive && onPalaceClick?.(b)}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              {/* 宫位背景 */}
              <path
                d={describePalaceArc(b, center, innerRadius, radius)}
                fill={isSelected ? colors.bg : '#ffffff'}
                stroke={isSelected ? colors.border : '#e5e7eb'}
                strokeWidth={isSelected ? 2 : 1}
                opacity={isSelected ? 1 : 0.9}
              />

              {/* 地支标注 */}
              <text x={pos.x} y={pos.y - 18} textAnchor="middle"
                fill="#6b7280" fontSize="10" fontWeight="bold">
                {b}
              </text>

              {/* 宫位名称 */}
              <text x={pos.x} y={pos.y - 4} textAnchor="middle"
                fill={colors.border} fontSize="13" fontWeight="bold">
                {palace.name}
                {palace.bodyPalace ? ' [身]' : ''}
              </text>

              {/* 主星 */}
              {palace.mainStars.length > 0 && (
                <text x={pos.x} y={pos.y + 12} textAnchor="middle"
                  fill="#374151" fontSize="10" fontWeight="semibold">
                  {palace.mainStars.slice(0, 3).join(' ')}
                </text>
              )}

              {/* 辅星（仅显示前2颗） */}
              {palace.minorStars.length > 0 && (
                <text x={pos.x} y={pos.y + 24} textAnchor="middle"
                  fill="#9ca3af" fontSize="8">
                  {palace.minorStars.slice(0, 2).join(' ')}
                </text>
              )}

              {/* 四化标记 */}
              {palace.sihua && (
                <circle cx={pos.x} cy={pos.y + 30} r="5"
                  fill={SIHUA_COLORS[palace.sihua]} />
              )}
            </g>
          );
        })}

        {/* 中心文字 */}
        <text x={center} y={center - 4} textAnchor="middle"
          fill="#7c3aed" fontSize="14" fontWeight="bold">
          紫微君
        </text>
        <text x={center} y={center + 14} textAnchor="middle"
          fill="#a78bfa" fontSize="9">
          {chart.elementBureau}
        </text>
      </svg>
    </div>
  );
}

/** 描述宫位的弧形路径 */
function describePalaceArc(
  branch: EarthlyBranch,
  cx: number,
  innerR: number,
  outerR: number,
): string {
  const idx = EARTHLY_BRANCHES.indexOf(branch);
  const startAngle = ((270 + idx * 30 - 15 + 360) % 360) * (Math.PI / 180);
  const endAngle = ((270 + idx * 30 + 15 + 360) % 360) * (Math.PI / 180);

  const x1 = cx + outerR * Math.cos(startAngle);
  const y1 = cx - outerR * Math.sin(startAngle);
  const x2 = cx + outerR * Math.cos(endAngle);
  const y2 = cx - outerR * Math.sin(endAngle);
  const x3 = cx + innerR * Math.cos(endAngle);
  const y3 = cx - innerR * Math.sin(endAngle);
  const x4 = cx + innerR * Math.cos(startAngle);
  const y4 = cx - innerR * Math.sin(startAngle);

  const largeArc = 0; // 30°是小弧
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}
