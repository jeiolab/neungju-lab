import React, { useState, useEffect } from 'react';
import { Key, Lock, Package, User, UserX, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { GameState } from '../types';

interface Props {
  onSuccess: () => void;
  onFail: () => void;
}

const KeyExchangePuzzle: React.FC<Props> = ({ onSuccess, onFail }) => {
  const [mode, setMode] = useState<'intro' | 'symmetric' | 'asymmetric'>('intro');
  const [step, setStep] = useState(0); // 0: Setup, 1: Action, 2: Transfer, 3: Result
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [boxState, setBoxState] = useState<'open' | 'locked-blue' | 'locked-public' | 'unlocked'>('open');
  const [message, setMessage] = useState("퍼즐 모드를 선택하세요.");
  const [showEve, setShowEve] = useState(false);

  // Reset when mode changes
  useEffect(() => {
    setStep(0);
    setSelectedItem(null);
    setBoxState('open');
    setShowEve(false);
    if (mode === 'symmetric') setMessage("미션: 같은 '파란 열쇠'를 밥(Bob)에게 전달하지 않고 상자를 잠가 보내세요. (불가능함을 체험)");
    if (mode === 'asymmetric') setMessage("미션: 밥(Bob)의 공개키(자물쇠)를 사용하여 안전하게 상자를 보내세요.");
  }, [mode]);

  const handleSelect = (item: string) => {
    if (step >= 2) return;
    setSelectedItem(item);
  };

  const handleAction = (target: string) => {
    if (!selectedItem) return;

    // Logic for Symmetric Mode
    if (mode === 'symmetric') {
      if (target === 'box' && selectedItem === 'key-blue') {
        setBoxState('locked-blue');
        setMessage("상자가 파란 열쇠로 잠겼습니다. 이제 밥에게 보내보세요.");
        setStep(1);
        setSelectedItem(null);
      } else if (target === 'bob' && boxState === 'locked-blue') {
        setStep(2); // Transfer
        setMessage("상자가 이동 중입니다...");
        setShowEve(true);
        setTimeout(() => {
            setMessage("경고! 이브가 중간에서 상자를 가로챘습니다.");
            setTimeout(() => {
                setMessage("이브는 파란 열쇠가 없지만... 만약 배송중에 열쇠도 같이 보냈다면?");
                // Symmetric fail scenario visual
                setStep(3);
                onFail(); // Fail logic triggers report
            }, 2000);
        }, 2000);
      }
    }

    // Logic for Asymmetric Mode
    if (mode === 'asymmetric') {
      // Step 0: Alice needs Bob's Public Key
      if (step === 0 && selectedItem === 'lock-public-bob' && target === 'alice') {
        setStep(1);
        setMessage("앨리스가 밥의 '공개 자물쇠'를 받았습니다. 이제 상자를 잠그세요.");
        setSelectedItem(null);
      }
      // Step 1: Lock the box
      else if (step === 1 && selectedItem === 'lock-public-bob' && target === 'box') {
        setBoxState('locked-public');
        setMessage("상자가 밥의 자물쇠로 잠겼습니다. 오직 밥의 개인키로만 열 수 있습니다. 전송하세요!");
        setSelectedItem(null);
      }
      // Step 2: Send to Bob
      else if (boxState === 'locked-public' && target === 'bob') {
        setStep(2);
        setShowEve(true);
        setMessage("상자가 이동 중입니다...");
        setTimeout(() => {
            setMessage("이브가 가로챘지만, 자물쇠를 열 수 없습니다! (개인키가 없음)");
            setTimeout(() => {
                setBoxState('unlocked');
                setStep(3);
                setMessage("성공! 밥이 자신의 개인키로 상자를 열었습니다.");
                onSuccess();
            }, 2500);
        }, 2000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {mode === 'intro' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <button 
            onClick={() => setMode('symmetric')}
            className="p-8 bg-white border-2 border-blue-200 rounded-2xl shadow hover:shadow-xl hover:border-blue-500 transition-all text-center group"
          >
            <Key className="mx-auto mb-4 text-blue-500 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-bold mb-2">대칭키 시나리오</h3>
            <p className="text-slate-500 text-sm">왜 열쇠 배달이 위험한지 체험해보세요.</p>
          </button>
          <button 
            onClick={() => setMode('asymmetric')}
            className="p-8 bg-white border-2 border-green-200 rounded-2xl shadow hover:shadow-xl hover:border-green-500 transition-all text-center group"
          >
            <div className="flex justify-center mb-4 space-x-2">
                <Lock className="text-green-500 group-hover:scale-110 transition-transform" size={48} />
                <Key className="text-red-500 group-hover:scale-110 transition-transform" size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">비대칭키(공개키) 시나리오</h3>
            <p className="text-slate-500 text-sm">자물쇠만 보내고 열쇠는 내가 갖는 마법!</p>
          </button>
        </div>
      )}

      {mode !== 'intro' && (
        <div className="bg-white rounded-xl shadow-xl p-6 relative min-h-[500px]">
          <button onClick={() => setMode('intro')} className="absolute top-4 left-4 text-xs bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">
            &larr; 돌아가기
          </button>
          
          <h2 className="text-center text-2xl font-bold mb-2">
            {mode === 'symmetric' ? '대칭키: 위험한 배송' : '비대칭키: 안전한 자물쇠'}
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center text-sm mb-8 animate-pulse">
            {message}
          </div>

          {/* Game Area */}
          <div className="flex justify-between items-center relative h-64">
            
            {/* Alice Area */}
            <div 
                className={`flex flex-col items-center p-4 border-2 rounded-xl transition-colors ${selectedItem && mode === 'asymmetric' && step === 0 ? 'border-green-400 bg-green-50 cursor-pointer' : 'border-blue-100'}`}
                onClick={() => mode === 'asymmetric' && step === 0 ? handleAction('alice') : null}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 relative">
                <User size={32} className="text-blue-600" />
                <span className="absolute -bottom-2 bg-blue-600 text-white text-xs px-2 rounded">Alice</span>
              </div>
              
              {/* Alice Inventory */}
              <div className="flex gap-2 mt-2">
                 {mode === 'symmetric' && (
                    <div 
                        onClick={() => handleSelect('key-blue')}
                        className={`cursor-pointer p-2 border rounded ${selectedItem === 'key-blue' ? 'bg-yellow-200 border-yellow-500' : 'bg-slate-50'}`}
                    >
                        <Key className="text-blue-600" size={20} />
                    </div>
                 )}
                 {mode === 'asymmetric' && step >= 1 && (
                     <div 
                        onClick={() => handleSelect('lock-public-bob')}
                        className={`cursor-pointer p-2 border rounded ${selectedItem === 'lock-public-bob' ? 'bg-green-200 border-green-500' : 'bg-slate-50'}`}
                     >
                         <Lock className="text-green-600" size={20} />
                     </div>
                 )}
              </div>
            </div>

            {/* Path & Eve */}
            <div className="flex-1 relative h-full flex flex-col justify-center items-center">
                <div className="w-full h-1 bg-slate-200 absolute top-1/2 -z-10"></div>
                
                {/* Package */}
                <div 
                    onClick={() => handleAction('box')}
                    className={`
                        transition-all duration-[2000ms] ease-in-out cursor-pointer
                        ${step === 2 ? 'translate-x-[150px]' : ''}
                        ${boxState !== 'open' && boxState !== 'unlocked' && step !== 3 ? 'bg-slate-200' : 'bg-yellow-100'}
                        p-4 rounded-lg shadow-md border-2 
                        ${selectedItem ? 'border-dashed border-blue-400' : 'border-yellow-400'}
                    `}
                >
                    <div className="relative">
                        <Package size={48} className="text-yellow-700" />
                        {boxState === 'locked-blue' && <Key size={24} className="text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        {boxState === 'locked-public' && <Lock size={24} className="text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        {boxState === 'unlocked' && <div className="absolute -top-2 -right-2 text-green-600 font-bold text-xs bg-white border rounded px-1">OPEN</div>}
                    </div>
                </div>

                {/* Eve */}
                <div className={`mt-8 transition-opacity duration-500 flex flex-col items-center ${showEve ? 'opacity-100' : 'opacity-0'}`}>
                    <UserX size={32} className="text-red-600" />
                    <span className="text-xs text-red-600 font-bold">Eve (해커)</span>
                    {mode === 'symmetric' && step === 3 && (
                         <div className="text-xs bg-red-100 text-red-800 p-1 rounded mt-1">열쇠 탈취 성공!</div>
                    )}
                     {mode === 'asymmetric' && step === 2 && (
                         <div className="text-xs bg-green-100 text-green-800 p-1 rounded mt-1">열 수 없음</div>
                    )}
                </div>
            </div>

            {/* Bob Area */}
            <div 
                className={`flex flex-col items-center p-4 border-2 border-purple-100 rounded-xl ${step >= 1 ? 'cursor-pointer hover:bg-purple-50' : ''}`}
                onClick={() => handleAction('bob')}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2 relative">
                <User size={32} className="text-purple-600" />
                <span className="absolute -bottom-2 bg-purple-600 text-white text-xs px-2 rounded">Bob</span>
              </div>

               {/* Bob Inventory */}
               <div className="flex gap-2 mt-2">
                 {mode === 'asymmetric' && (
                     <>
                        <div 
                            onClick={() => step === 0 ? handleSelect('lock-public-bob') : null}
                            className={`cursor-pointer p-2 border rounded ${selectedItem === 'lock-public-bob' ? 'bg-green-200 border-green-500' : 'bg-slate-50'}`}
                            title="밥의 공개키 (누구나 사용 가능)"
                        >
                            <Lock className="text-green-600" size={20} />
                        </div>
                        <div className="p-2 border rounded bg-slate-100" title="밥의 개인키 (절대 공개 안함)">
                            <Key className="text-red-600" size={20} />
                        </div>
                     </>
                 )}
              </div>
            </div>

          </div>

          <div className="mt-8 text-center text-slate-400 text-sm">
             {selectedItem ? '아이템이 선택되었습니다. 적용할 대상을 클릭하세요.' : '아이템을 클릭하여 선택하세요.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyExchangePuzzle;
