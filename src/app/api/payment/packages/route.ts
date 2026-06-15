// GET /api/payment/packages — 获取套餐列表
import { NextResponse } from 'next/server';
import { READING_PACKAGES } from '@/lib/payment';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: READING_PACKAGES,
  });
}
