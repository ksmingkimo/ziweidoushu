// POST /api/payment/notify — PayJS 支付回调
import { NextResponse } from 'next/server';
import { verifyNotifySign } from '@/lib/payment';
import { getDb, schema } from '@/db';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // PayJS 回调是 form-urlencoded
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // 验证签名
    if (!verifyNotifySign(params)) {
      console.error('支付回调签名验证失败');
      return new Response('fail', { status: 400 });
    }

    const returnCode = parseInt(params.return_code || '0');
    if (returnCode !== 1) {
      console.error('支付失败:', params.return_msg);
      return new Response('fail', { status: 400 });
    }

    // 解析附加数据
    let attach: { packageId?: string; count?: number } = {};
    try {
      attach = JSON.parse(params.attach || '{}');
    } catch { /* ignore */ }

    const outTradeNo = params.out_trade_no;
    const totalFee = parseInt(params.total_fee || '0');
    const payjsOrderId = params.payjs_order_id;

    // TODO: 关联用户 ID（需要认证上下文）
    // 生产环境中从 session 获取 userId
    // 此处先写数据库占位逻辑

    const db = getDb();

    // 记录订单
    // await db.insert(schema.orders).values({
    //   userId: userId,
    //   packageId: attach.packageId || 'unknown',
    //   amount: totalFee,
    //   status: 'paid',
    //   paymentMethod: params.type === 'alipay' ? 'alipay' : 'wechat',
    //   payjsOrderId: payjsOrderId,
    //   paidAt: new Date(),
    // });

    // 增加用户次数
    if (attach.count) {
      // await db.update(schema.credits)
      //   .set({
      //     remaining: sql`remaining + ${attach.count}`,
      //     updatedAt: new Date(),
      //   })
      //   .where(eq(schema.credits.userId, userId));
    }

    // PayJS 要求返回 "success"
    return new Response('success');
  } catch (error) {
    console.error('支付回调处理异常:', error);
    return new Response('fail', { status: 500 });
  }
}
