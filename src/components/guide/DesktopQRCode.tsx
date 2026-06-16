'use client';
// 桌面端二维码 — PC 访问时显示，方便手机扫码打开
import { useState, useEffect } from 'react';

export default function DesktopQRCode() {
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    // 检测是否桌面端
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod|webos|blackberry|windows phone/i.test(ua);
    if (!isMobile) {
      setVisible(true);
      setUrl(window.location.href);
    }
  }, []);

  if (!visible) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* 二维码卡片 */}
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="text-center mb-2">
          <p className="text-sm font-bold text-purple-800">📱 手机扫码打开</p>
          <p className="text-xs text-gray-400 mt-0.5">微信/浏览器扫码均可</p>
        </div>
        <div className="relative">
          <img
            src={qrUrl}
            alt="手机扫码访问"
            className="w-40 h-40 rounded-xl border"
          />
          {/* 扫码框动画 */}
          <div className="absolute inset-0 rounded-xl border-2 border-purple-500 opacity-40 animate-pulse pointer-events-none" />
        </div>
        <p className="text-center text-xs text-gray-400 mt-2 truncate max-w-40">
          {url.replace('https://', '')}
        </p>
      </div>
    </div>
  );
}
