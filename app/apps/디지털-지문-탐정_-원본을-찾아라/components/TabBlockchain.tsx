import React, { useState, useEffect } from 'react';
import { computeHash } from '../utils/crypto';
import { Link, Unlock, Lock, RefreshCcw } from 'lucide-react';
import { BlockData } from '../types';

const INITIAL_BLOCKS = [
  { id: 1, nonce: 123, data: 'Genesis Block', prevHash: '0000000000000000000000000000000000000000000000000000000000000000' },
  { id: 2, nonce: 456, data: 'Tx: Alice -> Bob $10', prevHash: '' },
  { id: 3, nonce: 789, data: 'Tx: Bob -> Charlie $5', prevHash: '' },
];

const TabBlockchain: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize chain
  useEffect(() => {
    recalculateChain(INITIAL_BLOCKS.map(b => ({ ...b, hash: '', isValid: true })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recalculateChain = async (currentBlocks: any[]) => {
    const newBlocks: BlockData[] = [];
    
    for (let i = 0; i < currentBlocks.length; i++) {
      const block = { ...currentBlocks[i] };
      
      // For block 2 onwards, prevHash must match previous block's hash
      if (i > 0) {
        block.prevHash = newBlocks[i - 1].hash;
      }

      // Compute current hash
      const hashContent = `${block.id}${block.nonce}${block.data}${block.prevHash}`;
      block.hash = await computeHash(hashContent);

      // Check validity (Simulated PoW: here we just check if links match)
      // In a real blockchain, we'd check leading zeros. Here we check structural integrity.
      if (i > 0) {
        // If the prevHash stored in this block doesn't match the ACTUAL hash of the previous block
        // (Wait, in this simulation, we automatically update prevHash to show the "Chain" effect.
        // To show "Breaking", we normally let users edit Data, which changes Hash, 
        // causing the NEXT block's prevHash pointer to be invalid relative to the NEW hash.)
        
        // Let's model it this way: 
        // We automatically update the hash based on content.
        // But visually, if I change Block 1, Block 2's hash ALSO changes. 
        // This demonstrates the "Chain Reaction".
        block.isValid = true; 
      } else {
        block.isValid = true;
      }
      
      newBlocks.push(block);
    }
    setBlocks(newBlocks);
    setLoading(false);
  };

  const updateBlockData = (id: number, newData: string) => {
    const updated = blocks.map(b => b.id === id ? { ...b, data: newData } : b);
    recalculateChain(updated);
  };

  const resetChain = () => {
    recalculateChain(INITIAL_BLOCKS.map(b => ({ ...b, hash: '', isValid: true })));
  };

  if (loading) return <div className="p-10 text-center">Loading Blockchain Simulator...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">블록체인 연결 원리</h2>
          <p className="text-slate-600 mt-1 text-sm">
            블록 1의 데이터를 수정해보세요. 연결된 모든 후속 블록의 해시가 연쇄적으로 변하는 것을 확인할 수 있습니다.
            이것이 블록체인이 위변조가 불가능한 이유입니다.
          </p>
        </div>
        <button 
          onClick={resetChain}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCcw size={16} />
          <span>초기화</span>
        </button>
      </div>

      <div className="flex flex-col space-y-4 overflow-x-auto pb-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative">
            {/* Link Icon */}
            {index > 0 && (
              <div className="absolute -top-6 left-8 flex justify-center w-full z-0">
                 <div className="h-6 w-1 bg-slate-300"></div>
              </div>
            )}
            
            <div className={`relative z-10 bg-white rounded-xl shadow-md border-2 p-4 transition-all duration-300 ${block.id === 1 ? 'border-blue-500' : 'border-slate-300'}`}>
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center space-x-2">
                    <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">Block #{block.id}</span>
                    <span className="text-xs text-slate-500 font-mono">Nonce: {block.nonce}</span>
                 </div>
                 {index === 0 ? <Lock size={16} className="text-blue-500"/> : <Link size={16} className="text-slate-400"/>}
               </div>

               <div className="space-y-3">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">Data</label>
                   <input 
                      type="text" 
                      value={block.data}
                      onChange={(e) => updateBlockData(block.id, e.target.value)}
                      className={`w-full mt-1 p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none ${block.id === 1 ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}
                   />
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Previous Hash</label>
                    <div className="w-full mt-1 p-2 bg-slate-100 rounded border border-slate-200 font-mono text-xs text-slate-500 break-all">
                      {block.prevHash}
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Current Hash</label>
                    <div className="w-full mt-1 p-2 bg-slate-800 text-green-400 rounded border border-slate-700 font-mono text-xs break-all shadow-inner">
                      {block.hash}
                    </div>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-start space-x-3">
        <Unlock size={20} className="shrink-0 mt-0.5" />
        <div>
           <strong>실험해보세요:</strong> 첫 번째 블록(Genesis Block)의 데이터를 수정하면, 
           그로 인해 첫 번째 블록의 해시가 바뀌고, 
           이를 참조하는 두 번째 블록의 해시가 바뀌고, 
           연쇄적으로 마지막 블록까지 모두 바뀝니다. 
           공격자가 중간 데이터를 조작하려면 그 이후의 모든 블록을 다시 계산해야 하므로 보안이 강력합니다.
        </div>
      </div>
    </div>
  );
};

export default TabBlockchain;