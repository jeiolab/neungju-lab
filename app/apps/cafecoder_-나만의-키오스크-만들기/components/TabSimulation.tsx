import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_MENU } from '../constants';
import { MenuItem, CartItem, FileSystem } from '../types';
import { ShoppingCart, Trash2, CreditCard, Save, RefreshCw, Plus, Minus } from 'lucide-react';

interface TabSimulationProps {
  fileSystem: FileSystem;
  setFileSystem: (fs: FileSystem) => void;
  onOrderComplete: () => void;
  onFileSave: () => void;
}

const TabSimulation: React.FC<TabSimulationProps> = ({ 
  fileSystem, 
  setFileSystem, 
  onOrderComplete,
  onFileSave
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [fileMode, setFileMode] = useState<'w' | 'a'>('a');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text: string, type: 'input' | 'output' | 'system' = 'output') => {
    const prefix = type === 'input' ? '>>> ' : '';
    setLogs(prev => [...prev, `${prefix}${text}`]);
  };

  const addToCart = (item: MenuItem) => {
    addLog(`selection = input("메뉴 선택") # User clicked ${item.name}`, 'input');
    addLog(`"${item.name}"`);
    addLog(`price = ${item.price}`);
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    addLog('--- 영수증 출력 시작 ---', 'system');
    addLog('print(f"{"메뉴":<10} {"수량":^5} {"가격":>8}")', 'input');
    addLog(`메뉴        수량      가격`);
    addLog('-'.repeat(30));
    
    cart.forEach(item => {
      const line = `${item.name.padEnd(10, ' ')} ${String(item.quantity).padStart(5, ' ')} ${String(item.price * item.quantity).padStart(8, ' ')}`;
      addLog(`print(f"{'${item.name}':<10} {${item.quantity}:^5} {${item.price * item.quantity}:>8}")`);
      addLog(line);
    });
    
    addLog(`print(f"총 합계: {total}원")`);
    addLog(`총 합계: ${calculateTotal()}원`);
    addLog('--- 주문 완료 ---', 'system');
    
    onOrderComplete();
  };

  const handleSaveToFile = () => {
    if (cart.length === 0) {
      alert("주문 내역이 없습니다.");
      return;
    }

    addLog(`f = open("order_log.txt", "${fileMode}", encoding="utf-8")`, 'input');
    
    let contentToAdd = "";
    const timestamp = new Date().toLocaleTimeString();
    contentToAdd += `\n[${timestamp}] 주문 내역\n`;
    cart.forEach(item => {
      contentToAdd += `${item.name}\t${item.quantity}잔\t${item.price * item.quantity}원\n`;
    });
    contentToAdd += `------------------------\n`;

    addLog(`f.write(order_data)`);
    addLog(`f.close()`);

    setFileSystem({
      ...fileSystem,
      "order_log.txt": fileMode === 'w' 
        ? contentToAdd.trim() 
        : (fileSystem["order_log.txt"] || "") + contentToAdd
    });

    onFileSave();
    setCart([]); // Clear cart after saving simulating "Day End" or "Order Processed"
    addLog("파일 저장 완료!", 'system');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Kiosk Interface (Left) */}
      <div className="flex-1 bg-gray-100 flex flex-col h-full overflow-hidden relative">
        <div className="bg-coffee-700 text-white p-4 shadow-md flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold">☕ CafeCoder Kiosk</h2>
          <span className="text-sm opacity-80">Python Mode: ON</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
           {/* Menu Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {INITIAL_MENU.map(item => (
              <button 
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-coffee-500 hover:shadow-md transition-all flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full bg-coffee-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.category === 'coffee' ? '☕' : item.category === 'ade' ? '🥤' : '🍰'}
                </div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-coffee-600">{item.price.toLocaleString()}원</p>
              </button>
            ))}
           </div>
        </div>

        {/* Cart/Checkout Sticky Footer */}
        <div className="bg-white border-t border-gray-200 p-4 absolute bottom-0 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-end mb-4 max-h-32 overflow-y-auto">
             <div className="w-full">
               <h4 className="text-sm font-bold text-gray-500 mb-2">장바구니 ({cart.reduce((a,c)=>a+c.quantity,0)})</h4>
               {cart.length === 0 ? (
                 <p className="text-gray-400 text-sm">메뉴를 선택해주세요.</p>
               ) : (
                 <ul className="space-y-2">
                   {cart.map(item => (
                     <li key={item.id} className="flex justify-between items-center text-sm">
                       <span className="font-medium text-gray-700">{item.name}</span>
                       <div className="flex items-center gap-2">
                         <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-coffee-600"><Minus size={14}/></button>
                         <span>{item.quantity}</span>
                         <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-coffee-600"><Plus size={14}/></button>
                         <span className="w-16 text-right font-mono">{(item.price * item.quantity).toLocaleString()}</span>
                         <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-2"><Trash2 size={14}/></button>
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="flex-1 bg-coffee-600 text-white py-3 rounded-lg font-bold hover:bg-coffee-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              {calculateTotal().toLocaleString()}원 결제하기 (영수증 출력)
            </button>
          </div>
        </div>
      </div>

      {/* Backend Console (Right) */}
      <div className="lg:w-96 bg-gray-900 text-green-400 flex flex-col h-1/2 lg:h-full shrink-0 border-t lg:border-t-0 lg:border-l border-gray-700">
        <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400">Python 3.10.2 (Simulated)</span>
          <button onClick={() => setLogs([])} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
            <RefreshCw size={12} /> Clear
          </button>
        </div>
        
        {/* Console Logs */}
        <div className="flex-1 p-4 font-mono text-xs md:text-sm overflow-y-auto space-y-1">
          <p className="opacity-50">Type "help", "copyright", "credits" or "license" for more information.</p>
          {logs.map((log, idx) => (
            <div key={idx} className={`${log.startsWith('>>>') ? 'text-white' : 'text-green-400'} whitespace-pre-wrap break-all`}>
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* File Control Panel */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <h4 className="text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <Save size={14} /> 매출 마감 (File I/O)
          </h4>
          <div className="flex gap-2 mb-2">
            <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
              <input 
                type="radio" 
                name="mode" 
                checked={fileMode === 'w'} 
                onChange={() => setFileMode('w')} 
                className="accent-coffee-500"
              /> 
              'w' (새로쓰기)
            </label>
            <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
              <input 
                type="radio" 
                name="mode" 
                checked={fileMode === 'a'} 
                onChange={() => setFileMode('a')} 
                className="accent-coffee-500"
              /> 
              'a' (이어쓰기)
            </label>
          </div>
          <button 
            onClick={handleSaveToFile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded font-mono transition-colors"
          >
            open("order_log.txt", "{fileMode}").write(...)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;