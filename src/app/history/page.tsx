'use client';
// 解读历史页
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  date: string;
  type: string;
  chartInfo: string;
  preview: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // 从 sessionStorage 恢复历史
    const saved = sessionStorage.getItem('readingHistory');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">暂无解读历史</h1>
        <p className="text-gray-500 mb-6">完成第一次 AI 解读后，记录会出现在这里</p>
        <Link href="/chart">
          <Button className="bg-purple-700 hover:bg-purple-800">去排盘 →</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">解读历史</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {item.type}
              </span>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{item.chartInfo}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{item.preview}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
