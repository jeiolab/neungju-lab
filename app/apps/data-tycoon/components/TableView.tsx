import React, { useState } from 'react';
import { Product } from '../types';
import { Button } from './Button';
import { Plus, Trash2, AlertTriangle, FileDown, Database } from 'lucide-react';

interface TableViewProps {
  data: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onDelete: (id: number) => void;
  highlightIds?: number[];
}

export const TableView: React.FC<TableViewProps> = ({ data, onAdd, onDelete, highlightIds = [] }) => {
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newSales, setNewSales] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndAdd = () => {
    setError(null);

    // Schema Validation Logic
    if (!newName.trim()) {
      setError("스키마 오류: '상품명'은 비워둘 수 없습니다.");
      return;
    }
    
    // Check if price is a valid integer
    const priceNum = Number(newPrice);
    if (!newPrice || isNaN(priceNum) || !Number.isInteger(priceNum)) {
      setError("타입 불일치: '가격'은 정수(Integer)여야 합니다. 문자나 소수를 입력했습니다.");
      return;
    }

    // Check if sales is a valid integer
    const salesNum = Number(newSales);
    if (!newSales || isNaN(salesNum) || !Number.isInteger(salesNum)) {
      setError("타입 불일치: '판매량'은 정수(Integer)여야 합니다. 문자를 입력했습니다.");
      return;
    }

    onAdd({
      name: newName,
      price: priceNum,
      sales: salesNum
    });

    setNewName('');
    setNewPrice('');
    setNewSales('');
  };

  const handleExportCSV = () => {
    const headers = "ID,상품명,가격,판매량,매출액\n";
    const rows = data.map(p => `${p.id},${p.name},${p.price},${p.sales},${p.price * p.sales}`).join("\n");
    // Add BOM for Excel to read Korean characters correctly
    const bom = "\uFEFF"; 
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(bom + headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "structured_data_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          데이터베이스 뷰 (표)
        </h2>
        <Button variant="outline" onClick={handleExportCSV} className="text-xs py-1 px-3 h-8">
          <FileDown className="w-3 h-3" /> CSV 내보내기
        </Button>
      </div>

      {/* Input Form - Simulating Schema Enforcement */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1">상품명 (문자열)</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예: 커피"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">가격 (정수)</label>
            <input 
              type="text" 
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="예: 3000"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">판매량 (정수)</label>
            <input 
              type="text" 
              value={newSales}
              onChange={(e) => setNewSales(e.target.value)}
              placeholder="예: 10"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
            />
          </div>
          <div className="col-span-2">
            <Button onClick={validateAndAdd} className="w-full h-[38px] text-sm">
              <Plus className="w-4 h-4" /> 추가
            </Button>
          </div>
        </div>
        
        {/* Validation Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2 animate-pulse">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">상품명</th>
              <th className="px-6 py-3 font-medium text-right">가격</th>
              <th className="px-6 py-3 font-medium text-right">판매량</th>
              <th className="px-6 py-3 font-medium text-right bg-blue-50 text-blue-700">매출액 (자동계산)</th>
              <th className="px-6 py-3 font-medium text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  데이터가 없습니다. 위에서 상품을 추가해주세요.
                </td>
              </tr>
            ) : (
              data.map((product) => {
                const isHighlighted = highlightIds.includes(product.id);
                return (
                  <tr 
                    key={product.id} 
                    className={`transition-colors ${isHighlighted ? 'bg-yellow-100' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-3 font-mono text-slate-400">{product.id}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{product.name}</td>
                    <td className="px-6 py-3 text-right font-mono">{product.price.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right font-mono">{product.sales.toLocaleString()}</td>
                    <td className={`px-6 py-3 text-right font-mono font-bold ${isHighlighted ? 'text-yellow-800' : 'text-blue-600'}`}>
                      {(product.price * product.sales).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="행 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};