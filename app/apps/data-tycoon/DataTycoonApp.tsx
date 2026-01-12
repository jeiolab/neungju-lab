'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TableView } from './components/TableView';
import { AnalysisPanel } from './components/AnalysisPanel';
import { QuizModal } from './components/QuizModal';
import { Product, QueryResult } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { Sparkles, Terminal } from 'lucide-react';

const DataTycoonApp: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [nextId, setNextId] = useState(4);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [lastResult, setLastResult] = useState<QueryResult | null>(null);
  
  // Handlers
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: nextId
    };
    setProducts([...products, product]);
    setNextId(nextId + 1);
    // Clear previous highlighting
    if (lastResult?.highlightIds) {
      setLastResult(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    if (lastResult?.highlightIds?.includes(id)) {
      setLastResult(null);
    }
  };

  const handleQueryResult = (result: QueryResult) => {
    setLastResult(result);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
          
          {/* Internal Header */}
          <header className="mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  편의점 사장님
                </h1>
                <p className="text-sm text-slate-500 leading-tight mt-0.5">정형 데이터의 특성과 SQL 쿼리를 시뮬레이션하며 배우는 인터랙티브 교육 앱입니다.</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <span className="font-semibold text-blue-600">정형 데이터(Structured Data)</span>가 비즈니스에 얼마나 강력한지 체험해보세요. 
              데이터의 형식(스키마)이 엄격하게 정의되어 있어(예: 가격은 무조건 숫자), 계산과 정렬을 순식간에 처리할 수 있습니다.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Data Table */}
            <div className="lg:col-span-8 h-[600px]">
              <TableView 
                data={products} 
                onAdd={handleAddProduct} 
                onDelete={handleDeleteProduct}
                highlightIds={lastResult?.highlightIds} 
              />
            </div>

            {/* Right Column: Controls & Results */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Analysis Console */}
              <AnalysisPanel data={products} onResult={handleQueryResult} />

              {/* Results Display */}
              <div className={`
                rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300
                ${lastResult ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white scale-100 opacity-100' : 'bg-slate-50 text-slate-400 scale-95 opacity-80 grayscale'}
              `}>
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5" />
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
                    {lastResult ? '쿼리 결과' : '시스템 대기 중'}
                  </h3>
                </div>

                {lastResult ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                      <div className="text-slate-400 text-xs uppercase mb-1">{lastResult.label}</div>
                      <div className="text-3xl font-bold text-blue-400 tracking-tight">{lastResult.value}</div>
                    </div>
                    
                    {lastResult.details && (
                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                          <Sparkles className="w-3 h-3" />
                          {lastResult.details}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-center text-sm">
                    분석 콘솔의 버튼을 눌러 쿼리를 실행해보세요.
                  </div>
                )}
              </div>

              {/* Tip Card */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                <p className="font-bold mb-1">💡 팁:</p>
                '가격' 입력 칸에 글자를 넣어보세요. 정형 데이터베이스는 데이터 무결성을 위해 엄격하게 타입(숫자/문자)을 구분하므로 에러가 발생합니다.
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

export default DataTycoonApp;

