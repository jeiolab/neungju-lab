import React from 'react';
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import { LogicBlock, VariableType, OperatorType, DiagnosisType } from '../types';

interface LogicBuilderProps {
  blocks: LogicBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<LogicBlock[]>>;
  disabled?: boolean;
}

const LogicBuilder: React.FC<LogicBuilderProps> = ({ blocks, setBlocks, disabled }) => {
  const addBlock = () => {
    const newBlock: LogicBlock = {
      id: Math.random().toString(36).substr(2, 9),
      variable: VariableType.SYSTOLIC,
      operator: OperatorType.GTE,
      value: 120,
      result: DiagnosisType.WARNING,
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, field: keyof LogicBlock, value: any) => {
    setBlocks(blocks.map(b => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          🩺 판정 로직 설계 (AI Brain)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          위에서부터 순서대로 검사합니다. 조건이 참(True)이면 즉시 판정을 내립니다.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                {index === 0 ? 'IF' : 'ELSE IF'}
              </span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors group">
              <div className="grid grid-cols-1 gap-2 mb-2">
                {/* Condition Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={block.variable}
                    onChange={(e) => updateBlock(block.id, 'variable', e.target.value)}
                    disabled={disabled}
                    className="bg-white border border-slate-300 text-sm rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {Object.values(VariableType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>

                  <select
                    value={block.operator}
                    onChange={(e) => updateBlock(block.id, 'operator', e.target.value)}
                    disabled={disabled}
                    className="bg-white border border-slate-300 text-sm rounded px-2 py-1 w-24 outline-none"
                  >
                    {Object.values(OperatorType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>

                  <input
                    type="number"
                    value={block.value}
                    onChange={(e) => updateBlock(block.id, 'value', parseInt(e.target.value))}
                    disabled={disabled}
                    className="bg-white border border-slate-300 text-sm rounded px-2 py-1 w-20 outline-none"
                  />
                </div>

                {/* Result Row */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-500">👉 결과:</span>
                  <select
                    value={block.result}
                    onChange={(e) => updateBlock(block.id, 'result', e.target.value)}
                    disabled={disabled}
                    className={`text-sm rounded px-2 py-1 font-bold outline-none border ${
                      block.result === DiagnosisType.DANGER ? 'bg-rose-50 border-rose-200 text-rose-600' :
                      block.result === DiagnosisType.WARNING ? 'bg-amber-50 border-amber-200 text-amber-600' :
                      'bg-emerald-50 border-emerald-200 text-emerald-600'
                    }`}
                  >
                    {Object.values(DiagnosisType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              {!disabled && (
                <button
                  onClick={() => removeBlock(block.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="flex justify-center my-1">
               <ArrowDown size={16} className="text-slate-300" />
            </div>
          </div>
        ))}

        {/* Catch-all Else Block (Static) */}
        <div className="relative opacity-80">
           <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                ELSE (그 외 모든 경우)
              </span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 border-dashed flex items-center gap-2">
               <span className="text-sm text-slate-500">👉 결과:</span>
               <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2 py-1 rounded">
                 {DiagnosisType.NORMAL}
               </span>
               <span className="text-xs text-slate-400 ml-auto">(기본값)</span>
            </div>
        </div>

      </div>

      {!disabled && (
        <button
          onClick={addBlock}
          className="mt-4 w-full py-2 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <Plus size={18} /> 조건 추가하기
        </button>
      )}
    </div>
  );
};

export default LogicBuilder;
