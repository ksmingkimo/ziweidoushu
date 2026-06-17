// 支付宝当面付 — 扫码支付
// 文档: https://opendocs.alipay.com/open/194/105072

import crypto from 'crypto';

interface AlipayConfig {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  notifyUrl: string;
}

function getConfig(): AlipayConfig {
  return {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: (process.env.ALIPAY_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    alipayPublicKey: (process.env.ALIPAY_PUBLIC_KEY || '').replace(/\\n/g, '\n'),
    notifyUrl: process.env.ALIPAY_NOTIFY_URL || 'https://ziweidoushu-xi.vercel.app/api/payment/notify',
  };
}

const ALIPAY_GATEWAY = 'https://openapi.alipay.com/gateway.do';

/** 生成签名 */
function sign(params: Record<string, string>, privateKey: string): string {
  const sortedKeys = Object.keys(params).sort();
  const content = sortedKeys
    .filter(k => params[k] !== '' && params[k] !== undefined && k !== 'sign')
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return crypto
    .createSign('RSA-SHA256')
    .update(content)
    .sign(privateKey, 'base64');
}

/** 当面付 - 预创建订单，返回二维码 */
export async function createPayOrder(params: {
  totalFee: number;
  outTradeNo: string;
  body: string;
  attach?: string;
}): Promise<{ success: boolean; qrcode?: string; error?: string; debug?: unknown }> {
  const config = getConfig();

  if (!config.appId || !config.privateKey) {
    return {
      success: false,
      error: '支付服务未配置',
      debug: { appId: !!config.appId, privateKey: !!config.privateKey },
    };
  }

  const bizContent = JSON.stringify({
    out_trade_no: params.outTradeNo,
    total_amount: (params.totalFee / 100).toFixed(2),
    subject: params.body,
    body: params.attach || '',
  });

  const requestParams: Record<string, string> = {
    app_id: config.appId,
    method: 'alipay.trade.precreate',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    version: '1.0',
    notify_url: config.notifyUrl,
    biz_content: bizContent,
  };

  requestParams.sign = sign(requestParams, config.privateKey);

  try {
    const formBody = new URLSearchParams(requestParams).toString();
    const response = await fetch(ALIPAY_GATEWAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });

    const data = await response.json();
    const precreate = data.alipay_trade_precreate_response;

    if (precreate?.code === '10000') {
      // 当面付返回的是二维码链接，需要转成二维码图片
      const qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(precreate.qr_code)}`;
      return { success: true, qrcode };
    }

    // 支付宝错误有两种格式：
    // 1. 业务级错误：alipay_trade_precreate_response.code != 10000
    // 2. 网关级错误：error_response（签名错误、参数缺失等）
    const errRes = data.error_response;
    const errMsg = precreate?.sub_msg
      || errRes?.sub_msg
      || precreate?.msg
      || errRes?.msg
      || '未知错误';
    const errCode = precreate?.code || errRes?.code || 'N/A';
    const errSubCode = precreate?.sub_code || errRes?.sub_code || '';

    return {
      success: false,
      error: `支付宝错误 [${errCode}${errSubCode ? '/' + errSubCode : ''}]: ${errMsg}`,
      debug: data,
    };
  } catch (error) {
    console.error('Alipay fetch error:', error);
    return { success: false, error: '支付服务异常', debug: String(error) };
  }
}

/** 验证支付宝异步通知签名 */
export function verifyNotifySign(params: Record<string, string>): boolean {
  const config = getConfig();
  const receivedSign = params.sign || '';
  const verifyParams = { ...params };
  delete verifyParams.sign;
  delete verifyParams.sign_type;

  try {
    const content = Object.keys(verifyParams)
      .filter(k => k !== 'sign' && k !== 'sign_type')
      .sort()
      .map(k => `${k}=${decodeURIComponent(verifyParams[k])}`)
      .join('&');

    return crypto
      .createVerify('RSA-SHA256')
      .update(content)
      .verify(config.alipayPublicKey, receivedSign, 'base64');
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
