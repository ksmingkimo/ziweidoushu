// POST /api/chart/calculate — 计算紫微斗数命盘
import { NextResponse } from 'next/server';
import { calculateChart } from '@/engine/chart';
import type { Gender } from '@/engine/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { solarYear, solarMonth, solarDay, hour, gender, name } = body;

    // 参数校验
    if (!solarYear || !solarMonth || !solarDay || hour == null || !gender) {
      return NextResponse.json(
        { error: '缺少必要参数：solarYear, solarMonth, solarDay, hour, gender' },
        { status: 400 },
      );
    }

    if (hour < 0 || hour > 23) {
      return NextResponse.json({ error: '小时必须在 0-23 之间' }, { status: 400 });
    }

    if (!['男', '女'].includes(gender)) {
      return NextResponse.json({ error: '性别必须为"男"或"女"' }, { status: 400 });
    }

    // 执行排盘
    const chartData = calculateChart(
      Number(solarYear),
      Number(solarMonth),
      Number(solarDay),
      Number(hour),
      gender as Gender,
      name,
    );

    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    console.error('排盘计算失败:', error);
    return NextResponse.json(
      { error: '排盘计算失败，请检查输入的日期是否正确' },
      { status: 500 },
    );
  }
}
