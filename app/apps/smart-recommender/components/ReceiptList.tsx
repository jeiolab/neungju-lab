import React from 'react';
import { Receipt, ITEMS } from '../types';

interface ReceiptListProps {
  receipts: Receipt[];
}

export const ReceiptList: React.FC<ReceiptListProps> = ({ receipts }) => {
  const getItemEmoji = (id: string) => ITEMS.find(i => i.id === id)?.emoji || '?';
  const getItemName = (id: string) => ITEMS.find(i => i.id === id)?.name || id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-full overflow-y-auto max-h-[500px]">
      <h3 className="text-lg font-bold text-slate-800 mb-4 sticky top-0 bg-white pb-2 border-b">
        📄 오늘의 영수증 데이터
      </h3>
      <div className="space-y-3">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
            <div className="font-semibold text-slate-500 mb-1">영수증 #{receipt.id}</div>
            <div className="flex flex-wrap gap-2">
              {receipt.items.map((itemId) => (
                <span key={itemId} className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm text-slate-700">
                  <span className="mr-1">{getItemEmoji(itemId)}</span>
                  {getItemName(itemId)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};