import React, { useState } from 'react';
import { Header } from './components/Header';
import { TableView } from './components/TableView';
import { AnalysisPanel } from './components/AnalysisPanel';
import { QuizModal } from './components/QuizModal';
import { Product, QueryResult } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { Sparkles, Terminal } from 'lucide-react';

const App: React.FC = () => {
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
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <Header onOpenQuiz={() => setIsQuizOpen(true)} />

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Intro Banner */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-2 text-slate-800">정형 데이터 시뮬레이션에 오신 것을 환영합니다</h2>
          <p className="text-slate-600 leading-relaxed">
            <span className="font-semibold text-blue-600">정형 데이터(Structured Data)</span>가 비즈니스에 얼마나 강력한지 체험해보세요. 
            데이터의 형식(스키마)이 엄격하게 정의되어 있어(예: 가격은 무조건 숫자), 계산과 정렬을 순식간에 처리할 수 있습니다.
          </p>
        </section>

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
      </main>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

export default App;