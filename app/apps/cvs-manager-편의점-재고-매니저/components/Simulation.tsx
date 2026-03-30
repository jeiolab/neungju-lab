import React, { useState, useEffect, useRef } from 'react';
import { Item, Customer, LogEntry, StoreState } from '../types';
import { INITIAL_ITEMS, INITIAL_CUSTOMER_MONEY, INITIAL_CUSTOMER_NAME } from '../constants';
import { ShoppingCart, Plus, RefreshCw, Trash2, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';

export const Simulation: React.FC = () => {
  // --- State ---
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [customer, setCustomer] = useState<Customer>({
    name: INITIAL_CUSTOMER_NAME,
    money: INITIAL_CUSTOMER_MONEY,
    inventory: []
  });
  const [store, setStore] = useState<StoreState>({ revenue: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showReport, setShowReport] = useState(false);
  
  // For scrolling logs
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- Actions ---
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleBuy = (item: Item) => {
    // 1. Check stock
    if (item.stock <= 0) {
      addLog(`[Error] '${item.name}' 재고가 없습니다! (Stock: 0)`, 'error');
      return;
    }

    // 2. Check money
    if (customer.money < item.price) {
      addLog(`[Error] 잔액이 부족합니다! (필요: ${item.price}원, 보유: ${customer.money}원)`, 'warning');
      return;
    }

    // 3. Execute Transaction
    // Update Item Stock
    setItems(prevItems => prevItems.map(i => 
      i.id === item.id ? { ...i, stock: i.stock - 1 } : i
    ));

    // Update Customer (Money down, Inventory up)
    setCustomer(prevCust => {
      const existingItemIndex = prevCust.inventory.findIndex(inv => inv.item.id === item.id);
      let newInventory = [...prevCust.inventory];
      
      if (existingItemIndex >= 0) {
        newInventory[existingItemIndex].count += 1;
      } else {
        newInventory.push({ item, count: 1 });
      }

      return {
        ...prevCust,
        money: prevCust.money - item.price,
        inventory: newInventory
      };
    });

    // Update Store Revenue
    setStore(prevStore => ({ ...prevStore, revenue: prevStore.revenue + item.price }));

    // Log
    addLog(`[구매 성공] ${customer.name}님이 ${item.name}을(를) 구매했습니다. (-${item.price}원)`, 'success');
  };

  const handleReset = () => {
    setItems(INITIAL_ITEMS);
    setCustomer({ name: INITIAL_CUSTOMER_NAME, money: INITIAL_CUSTOMER_MONEY, inventory: [] });
    setStore({ revenue: 0 });
    setLogs([]);
    setShowReport(false);
    addLog('시뮬레이션이 초기화되었습니다.', 'info');
  };

  const addItemStock = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: i.stock + 1 } : i));
    addLog(`[관리자] 재고 추가됨`, 'info');
  };

  const isSoldOutKing = items.every(i => i.stock === 0);

  return (
    <div className="max-w-6xl mx-auto p-2 h-full flex flex-col gap-4">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Status */}
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Customer Wallet</p>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-800">{customer.money.toLocaleString()}원</span>
                {customer.money < 1000 && <span className="text-xs text-red-500 font-bold animate-pulse">잔액 부족 위험!</span>}
            </div>
          </div>
          <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Store Status */}
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-600 flex items-center justify-between">
           <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Store Revenue</p>
            <p className="text-2xl font-bold text-gray-800">+{store.revenue.toLocaleString()}원</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <TrendingUp size={24} />
          </div>
        </div>

         {/* Controls */}
         <div className="flex items-center gap-2 justify-end">
            <button 
                onClick={() => setShowReport(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <TrendingUp size={16} /> 정산 리포트
            </button>
            <button 
                onClick={handleReset}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <RefreshCw size={16} /> 초기화
            </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left: Store Shelves */}
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                      🏪 편의점 진열대 (Item Objects)
                  </h3>
                  {isSoldOutKing && <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold animate-bounce">🏆 완판왕 달성!</span>}
              </div>
              
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {items.map(item => (
                  <div key={item.id} className={`relative group border-2 rounded-xl p-4 flex flex-col items-center transition-all duration-200 ${item.stock === 0 ? 'border-gray-200 bg-gray-50 opacity-60 grayscale' : 'border-blue-100 bg-white hover:border-blue-400 hover:shadow-md'}`}>
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{item.price.toLocaleString()}원</p>
                    
                    <div className="w-full flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                        <span className={`text-xs font-mono font-bold ${item.stock <= 2 ? 'text-red-500' : 'text-gray-400'}`}>
                            Stock: {item.stock}
                        </span>
                        {/* Admin Stock Add Button (Hidden feature for teachers/testing) */}
                        <button onClick={() => addItemStock(item.id)} className="text-gray-300 hover:text-green-500" title="재고 보충 (관리자)">
                           <Plus size={12} />
                        </button>
                    </div>

                    <button 
                        onClick={() => handleBuy(item)}
                        disabled={item.stock === 0}
                        className={`w-full mt-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${item.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {item.stock === 0 ? '품절' : <>구매하기 <ShoppingCart size={14} /></>}
                    </button>
                  </div>
                ))}
              </div>
           </div>

           {/* Console Log */}
           <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col h-48">
              <div className="bg-gray-800 px-4 py-2 text-xs font-mono text-gray-400 flex justify-between items-center">
                  <span>TERMINAL OUTPUT (Event Log)</span>
                  <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
              </div>
              <div className="p-4 overflow-y-auto font-mono text-sm space-y-1 flex-1">
                 {logs.length === 0 && <span className="text-gray-600 opacity-50">&gt; Waiting for user interactions...</span>}
                 {logs.map(log => (
                    <div key={log.id} className="flex gap-2">
                        <span className="text-gray-500">[{log.timestamp}]</span>
                        <span className={`${
                            log.type === 'error' ? 'text-red-400' : 
                            log.type === 'warning' ? 'text-yellow-400' :
                            log.type === 'success' ? 'text-green-400' : 'text-blue-300'
                        }`}>
                           {log.type === 'error' ? 'Error:' : '>'} {log.message}
                        </span>
                    </div>
                 ))}
                 <div ref={logsEndRef} />
              </div>
           </div>
        </div>

        {/* Right: Customer Inventory */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
             <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
                <h3 className="font-bold text-orange-800 flex items-center gap-2">
                    🎒 고객 가방 (Inventory)
                </h3>
             </div>
             <div className="p-4 flex-1 overflow-y-auto">
                {customer.inventory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-10">
                        <ShoppingBag size={48} className="opacity-20" />
                        <p className="text-sm">구매한 상품이 없습니다.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {customer.inventory.map((slot, idx) => (
                            <li key={idx} className="bg-white border rounded-lg p-3 flex items-center justify-between shadow-sm animate-fade-in-right">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{slot.item.icon}</span>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{slot.item.name}</p>
                                        <p className="text-xs text-gray-500">{slot.item.price}원</p>
                                    </div>
                                </div>
                                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                                    x {slot.count}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
             </div>
             
             {/* Total Value Logic Visualizer */}
             <div className="p-4 bg-gray-50 border-t text-xs text-gray-500 font-mono">
                 <p className="mb-1"># Object State Tracker:</p>
                 <div className="grid grid-cols-2 gap-2">
                     <div>Cust.inventory_count: <span className="text-gray-900">{customer.inventory.reduce((acc, curr) => acc + curr.count, 0)}</span></div>
                     <div>Cust.spent: <span className="text-gray-900">{INITIAL_CUSTOMER_MONEY - customer.money}</span></div>
                 </div>
             </div>
        </div>

      </div>

      {/* Daily Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold mb-1">📅 일일 정산 리포트</h2>
                    <p className="text-blue-200 text-sm">CVS Manager Daily Closing</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">총 매출액</span>
                        <span className="text-2xl font-bold text-blue-600">{store.revenue.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">남은 고객 잔액</span>
                        <span className="text-lg font-bold text-gray-800">{customer.money.toLocaleString()}원</span>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">판매된 상품 수</span>
                        <span className="text-lg font-bold text-gray-800">{customer.inventory.reduce((a,b)=>a+b.count,0)}개</span>
                    </div>
                    
                    {isSoldOutKing && (
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center gap-3">
                            <span className="text-3xl">🏆</span>
                            <div>
                                <p className="font-bold text-yellow-800">완판왕 배지 획득!</p>
                                <p className="text-xs text-yellow-700">모든 상품 재고를 소진시켰습니다.</p>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={() => setShowReport(false)}
                        className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors mt-4"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};