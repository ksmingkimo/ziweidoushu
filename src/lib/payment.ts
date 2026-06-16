// PayJS 聚合支付客户端
// 文档: https://payjs.cn/docs/

interface PayJSConfig {
  mchid: string;
  key: string;
  notifyUrl: string;
}

interface CreateOrderParams {
  totalFee: number;     // 金额（分）
  outTradeNo: string;   // 商户订单号
  body: string;         // 商品描述
  attach?: string;      // 附加数据
  type?: 'alipay' | 'wechat'; // 支付方式，默认微信
}

interface PayJSResponse {
  return_code: number;  // 1=成功
  return_msg: string;
  payjs_order_id: string;
  qrcode: string;       // 二维码支付链接
  code_url: string;     // 微信 code_url
  sign: string;
}

const PAYJS_API = 'https://payjs.cn/api/native';

function getConfig(): PayJSConfig {
  return {
    mchid: process.env.PAYJS_MCHID || '',
    key: process.env.PAYJS_KEY || '',
    notifyUrl: process.env.PAYJS_NOTIFY_URL || '',
  };
}

/** 简单签名（MD5） */
function createSign(params: Record<string, string>, key: string): string {
  // PayJS 签名规则：按 key 排序，拼接 key=value&key=value...&key=密钥
  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys
    .filter(k => params[k] !== '' && params[k] !== undefined)
    .map(k => `${k}=${params[k]}`)
    .join('&');
  // 使用 crypto 计算 MD5
  const crypto = require('crypto');
  return crypto.createHash('md5').update(signStr + key).digest('hex').toUpperCase();
}

/** 创建支付订单 */
export async function createPayOrder(params: CreateOrderParams): Promise<{
  success: boolean;
  payjsOrderId?: string;
  qrcode?: string;
  error?: string;
}> {
  const config = getConfig();

  if (!config.mchid || !config.key) {
    return { success: false, error: '支付服务未配置' };
  }

  const body: Record<string, string> = {
    mchid: config.mchid,
    total_fee: String(params.totalFee),
    out_trade_no: params.outTradeNo,
    body: params.body,
    notify_url: config.notifyUrl,
  };

  if (params.attach) body.attach = params.attach;
  if (params.type) body.type = params.type;

  body.sign = createSign(body, config.key);

  try {
    const response = await fetch(PAYJS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body).toString(),
    });

    const data: PayJSResponse = await response.json();

    if (data.return_code === 1) {
      return {
        success: true,
        payjsOrderId: data.payjs_order_id,
        qrcode: data.qrcode || data.code_url,
      };
    }

    return { success: false, error: data.return_msg || '支付下单失败' };
  } catch (error) {
    return { success: false, error: '支付服务异常' };
  }
}

/** 验证支付回调签名 */
export function verifyNotifySign(params: Record<string, string>): boolean {
  const config = getConfig();
  const receivedSign = params.sign;
  const sign = createSign(
    Object.fromEntries(Object.entries(params).filter(([k]) => k !== 'sign')),
    config.key,
  );
  return sign === receivedSign;
}

// ---- 套餐定义 ----

export interface ReadingPackage {
  id: string;
  name: string;
  count: number;
  price: number;  // 分
  description: string;
  popular?: boolean;
}

export const READING_PACKAGES: ReadingPackage[] = [
  {
    id: 'single',
    name: '单次解读',
    count: 1,
    price: 100,  // ¥1.00
    description: '适合初次体验',
  },
  {
    id: 'pack5',
    name: '5次套餐',
    count: 5,
    price: 300,  // ¥3.00
    description: '每题仅¥0.6，适合深度探索',
    popular: true,
  },
  {
    id: 'pack10',
    name: '10次套餐',
    count: 10,
    price: 500, // ¥5.00
    description: '每题仅¥0.5，适合全面了解',
  },
];
