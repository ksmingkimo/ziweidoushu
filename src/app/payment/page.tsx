'use client';
// 支付页
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { READING_PACKAGES, type ReadingPackage } from '@/lib/payment';
import { Check } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('pack5');
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selected }),
      });
      const data = await res.json();
      if (data.success) {
        setQrcode(data.data.qrcode);
      } else {
        setError(data.error || '创建订单失败');
      }
    } catch {
      setError('支付服务暂不可用');
    } finally {
      setLoading(false);
    }
  };

  const pkg = READING_PACKAGES.find(p => p.id === selected);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">购买解读次数</h1>
      <p className="text-center text-gray-500 mb-8">选择适合你的套餐，解锁 AI 命理解读</p>

      {/* 套餐选择 */}
      <div className="grid gap-4 mb-8">
        {READING_PACKAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelected(p.id); setQrcode(null); }}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
              selected === p.id
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-800">{p.name}</span>
                  {p.popular && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                      推荐
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{p.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-700">¥{(p.price / 100).toFixed(0)}</p>
                <p className="text-xs text-gray-400">{p.count}次解读</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 支付区域 */}
      {qrcode ? (
        <Card className="p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-2">扫码支付</h3>
          <p className="text-gray-500 text-sm mb-4">请使用微信或支付宝扫描二维码</p>
          <img src={qrcode} alt="支付二维码" className="mx-auto w-48 h-48 mb-4" />
          <p className="text-sm text-gray-400">支付金额：¥{(pkg?.price || 0) / 100}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              // 模拟支付成功
              const credits = parseInt(sessionStorage.getItem('freeReadings') || '0');
              sessionStorage.setItem('freeReadings', String(Math.max(0, credits + (pkg?.count || 0) - 3)));
              router.push('/reading');
            }}
          >
            模拟支付成功（开发用）
          </Button>
        </Card>
      ) : (
        <div className="text-center">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="bg-purple-700 hover:bg-purple-800 text-lg px-12 py-6"
          >
            {loading ? '创建订单中...' : `支付 ¥${(pkg?.price || 0) / 100} →`}
          </Button>
        </div>
      )}
    </div>
  );
}
