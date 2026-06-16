'use client';
// 解读历史页 — 从 sessionStorage 读取真实保存的解读记录
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

interface HistoryEntry {
  id: string;
  date: string;
  type: string;
  typeLabel: string;
  chartInfo: string;
  preview: string;
  content: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  useEffect(() => {
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
        <p className="text-gray-500 mb-6">完成第一次 AI 解读后，记录会自动保存在这里</p>
        <Link href="/chart">
          <Button className="bg-purple-700 hover:bg-purple-800">去排盘 →</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">解读历史</h1>
      <p className="text-sm text-gray-500 mb-6">共 {items.length} 条记录（存储于本地浏览器）</p>

      <div className="space-y-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelected(item)}
          >
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-sm font-medium text-purple-700">{item.typeLabel}</span>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1.5">{item.chartInfo}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{item.preview}</p>
          </Card>
        ))}
      </div>

      {/* 查看详情弹窗 */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.typeLabel}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="text-sm text-gray-500 mb-4">
              <p>{selected.date} · {selected.chartInfo}</p>
            </div>
          )}
          <div className="prose prose-sm max-w-none">
            {selected?.content.split('\n').map((line, i) => (
              <p key={i} className="mb-2 text-gray-700 leading-relaxed">
                {line || ' '}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
