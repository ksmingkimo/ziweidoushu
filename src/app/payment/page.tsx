'use client';
// 支付页 — 个人收款码 + 手动确认
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { READING_PACKAGES, type ReadingPackage } from '@/lib/payment';

export default function PaymentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('pack5');
  const [showQR, setShowQR] = useState(false);
  const [paid, setPaid] = useState(false);

  const pkg = READING_PACKAGES.find(p => p.id === selected);

  const handlePay = () => {
    if (!pkg) return;
    // 直接增加次数
    const stored = sessionStorage.getItem('purchasedCredits') || '0';
    const current = parseInt(stored);
    sessionStorage.setItem('purchasedCredits', String(current + pkg.count));

    // 保存购买记录
    const history = JSON.parse(sessionStorage.getItem('purchaseHistory') || '[]');
    history.unshift({
      id: 'P' + Date.now(),
      packageName: pkg.name,
      count: pkg.count,
      amount: pkg.price,
      time: new Date().toISOString(),
    });
    sessionStorage.setItem('purchaseHistory', JSON.stringify(history.slice(0, 20)));

    setPaid(true);
  };

  if (paid) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">购买成功！</h1>
        <p className="text-gray-500 mb-6">
          已获得 <strong className="text-purple-700">{pkg?.count} 次</strong> 解读次数
        </p>
        <Button
          onClick={() => router.push('/reading')}
          className="bg-purple-700 hover:bg-purple-800"
        >
          去解读 →
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">购买解读次数</h1>
      <p className="text-center text-gray-500 mb-6">选择套餐，扫码支付即可</p>

      {/* 套餐选择 */}
      <div className="space-y-3 mb-6">
        {READING_PACKAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelected(p.id); setShowQR(false); }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selected === p.id
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{p.name}</span>
                  {p.popular && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                      推荐
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-700">¥{p.price / 100}</p>
                <p className="text-xs text-gray-400">{p.count}次</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!showQR ? (
        <div className="text-center">
          <Button
            onClick={() => setShowQR(true)}
            className="bg-purple-700 hover:bg-purple-800 text-lg px-12 py-6 w-full"
          >
            支付 ¥{pkg ? pkg.price / 100 : 0} →
          </Button>
        </div>
      ) : (
        <Card className="p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-1">微信扫码支付</h3>
          <p className="text-gray-500 text-sm mb-4">
            支付金额：<strong className="text-purple-700">¥{pkg ? pkg.price / 100 : 0}</strong>
          </p>
          <img
            src={`/qr_${pkg ? pkg.price / 100 : 0}.jpg`}
            alt="微信收款码"
            className="mx-auto w-52 h-52 border rounded-lg mb-4"
          />
          <p className="text-xs text-gray-400 mb-4">请使用微信扫一扫</p>
          <Button
            onClick={handlePay}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            我已支付 ✓
          </Button>
          <p className="text-xs text-gray-400 mt-3">诚信交易，感谢信任 🤝</p>
        </Card>
      )}
    </div>
  );
}
