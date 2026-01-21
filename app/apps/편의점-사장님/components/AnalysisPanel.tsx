import React from 'react';
import { Product, QueryResult } from '../types';
import { Button } from './Button';
import { Search, Calculator, Trophy, ArrowUpNarrowWide } from 'lucide-react';

interface AnalysisPanelProps {
  data: Product[];
  onResult: (result: QueryResult) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data, onResult }) => {
  
  const handleQuery = (type: string) => {
    // Simulate query time (always fast for structured data)
    const startTime = performance.now();
    
    let result: QueryResult | null = null;

    if (data.length === 0) {
      onResult({ type: 'text', label: '오류', value: '분석할 데이터가 없습니다.' });
      return;
    }

    switch (type) {
      case 'total_revenue':
        const total = data.reduce((acc, curr) => acc + (curr.price * curr.sales), 0);
        result = {
          type: 'number',
          label: '총 매출',
          value: total.toLocaleString(),
          details: `${data.length}개 행의 SUM(가격 * 판매량)`
        };
        break;

      case 'best_seller':
        const best = [...data].sort((a, b) => b.sales - a.sales)[0];
        result = {
          type: 'text',
          label: '최다 판매 상품 (판매량)',
          value: `${best.name} (${best.sales}개)`,
          highlightIds: [best.id],
          details: `ORDER BY 판매량 DESC LIMIT 1`
        };
        break;
        
      case 'highest_revenue_item':
        const topRev = [...data].sort((a, b) => (b.price * b.sales) - (a.price * a.sales))[0];
        result = {
          type: 'text',
          label: '최고 매출 상품',
          value: `${topRev.name} (₩${(topRev.price * topRev.sales).toLocaleString()})`,
          highlightIds: [topRev.id],
          details: `ORDER BY (가격 * 판매량) DESC LIMIT 1`
        };
        break;

      case 'count_items':
        result = {
          type: 'number',
          label: '총 품목 수',
          value: `${data.length}개`,
          details: `COUNT(*)`
        };
        break;
    }

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(3);

    if (result) {
      // Append the speed message to the existing result
      onResult({
        ...result,
        details: `${result.details} — ${duration}ms 소요됨`
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <div className="bg-green-100 p-2 rounded-lg">
          <Calculator className="w-5 h-5 text-green-700" />
        </div>
        분석 콘솔 (쉬운 SQL 모드)
      </h3>
      
      <p className="text-sm text-slate-500 mb-6">
        정형 데이터베이스에 질문을 던져보세요. 스키마가 정의되어 있어 계산이 즉시 완료됩니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          variant="secondary" 
          onClick={() => handleQuery('total_revenue')}
          className="justify-start h-12 text-sm"
        >
          <Calculator className="w-4 h-4 text-slate-500" />
          총 매출 계산하기
        </Button>

        <Button 
          variant="secondary" 
          onClick={() => handleQuery('best_seller')}
          className="justify-start h-12 text-sm"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          가장 많이 팔린 물건은?
        </Button>

        <Button 
          variant="secondary" 
          onClick={() => handleQuery('highest_revenue_item')}
          className="justify-start h-12 text-sm"
        >
          <ArrowUpNarrowWide className="w-4 h-4 text-purple-500" />
          매출 1위 효자 상품
        </Button>
        
         <Button 
          variant="secondary" 
          onClick={() => handleQuery('count_items')}
          className="justify-start h-12 text-sm"
        >
          <Search className="w-4 h-4 text-blue-500" />
          재고 품목 수 세기
        </Button>
      </div>
    </div>
  );
};