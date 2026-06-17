// PayJS 支付 — 扫码支付（个人可用，无需营业执照）
// 文档: https://payjs.cn/docs/

import crypto from 'crypto';

interface PayJSConfig {
  mchid: string;
  key: string;
  notifyUrl: string;
}

function getConfig(): PayJSConfig {
  return {
    mchid: process.env.PAYJS_MCHID || '',
    key: process.env.PAYJS_KEY || '',
    notifyUrl: process.env.PAYJS_NOTIFY_URL || 'https://ziweidoushu-xi.vercel.app/api/payment/notify',
  };
}

const PAYJS_API = 'https://payjs.cn/api/native';

/** PayJS MD5 签名：所有参数按 key 排序 → 拼接 → 追加密钥 → MD5 */
function sign(params: Record<string, string>, key: string): string {
  const sortedKeys = Object.keys(params).sort();
  const content = sortedKeys
    .filter(k => params[k] !== '' && params[k] !== undefined && k !== 'sign')
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return crypto
    .createHash('md5')
    .update(content + '&key=' + key)
    .digest('hex')
    .toUpperCase();
}

/** 创建扫码支付订单，返回二维码 */
export async function createPayOrder(params: {
  totalFee: number;
  outTradeNo: string;
  body: string;
  attach?: string;
}): Promise<{ success: boolean; qrcode?: string; error?: string; debug?: unknown }> {
  const config = getConfig();

  if (!config.mchid || !config.key) {
    return {
      success: false,
      error: '支付服务未配置',
      debug: { mchid: !!config.mchid, key: !!config.key },
    };
  }

  const requestParams: Record<string, string> = {
    mchid: config.mchid,
    total_fee: String(params.totalFee), // 单位：分
    out_trade_no: params.outTradeNo,
    body: params.body,
    attach: params.attach || '',
    notify_url: config.notifyUrl,
  };

  requestParams.sign = sign(requestParams, config.key);

  try {
    const response = await fetch(PAYJS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(requestParams).toString(),
    });

    const data = await response.json();

    if (data.return_code === 1) {
      // code_url 是支付链接，转成二维码图片
      const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.code_url)}`;
      return { success: true, qrcode };
    }

    return {
      success: false,
      error: data.return_msg || data.msg || '未知错误',
      debug: data,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('PayJS error:', errMsg);
    return { success: false, error: `支付异常: ${errMsg}`, debug: errMsg };
  }
}

/** 验证 PayJS 异步通知签名 */
export function verifyNotifySign(params: Record<string, string>): boolean {
  const config = getConfig();
  const receivedSign = (params.sign || '').toUpperCase();
  const verifyParams = { ...params };
  delete verifyParams.sign;

  try {
    const computedSign = sign(verifyParams, config.key);
    return computedSign === receivedSign;
  } catch {
    return false;
  }
}

// ---- 套餐定义 ----

export interface ReadingPackage {
  id: string;
  name: string;
  count: number;
  price: number;
  description: string;
  popular?: boolean;
}

export const READING_PACKAGES: ReadingPackage[] = [
  { id: 'single', name: '单次解读', count: 1, price: 100, description: '¥1，适合初次体验' },
  { id: 'pack5', name: '5次套餐', count: 5, price: 300, description: '¥3，每次仅¥0.6', popular: true },
  { id: 'pack10', name: '10次套餐', count: 10, price: 500, description: '¥5，每次仅¥0.5' },
];
