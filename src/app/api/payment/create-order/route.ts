// POST /api/payment/create-order — 创建支付订单
import { NextResponse } from 'next/server';
import { createPayOrder, READING_PACKAGES } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageId } = body;

    const pkg = READING_PACKAGES.find(p => p.id === packageId);
    if (!pkg) {
      return NextResponse.json(
        { error: '无效的套餐' },
        { status: 400 },
      );
    }

    // 生成商户订单号
    const outTradeNo = `ZIWEI_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const result = await createPayOrder({
      totalFee: pkg.price,
      outTradeNo,
      body: `紫微君·${pkg.name}`,
      attach: JSON.stringify({ packageId: pkg.id, count: pkg.count }),
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          orderNo: outTradeNo,
          qrcode: result.qrcode,
          amount: pkg.price,
          packageName: pkg.name,
        },
      });
    }

    return NextResponse.json(
      { error: result.error || '创建订单失败' },
      { status: 500 },
    );
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 },
    );
  }
}
