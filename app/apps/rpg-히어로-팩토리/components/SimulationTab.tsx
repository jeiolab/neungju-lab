import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HeroClass, HeroInstance, LogEntry } from '../types';
import { Plus, Trash2, Zap, RefreshCw, Skull, Save, Play, MessageSquareQuote } from 'lucide-react';
import { generateClassExplanation } from '../services/geminiService';

const DEFAULT_CLASS: HeroClass = {
  className: 'Wizard',
  baseHp: 100,
  baseMp: 50,
  skills: [{ name: 'Fireball', damage: 20, manaCost: 10 }]
};

const SimulationTab: React.FC = () => {
  const [heroClass, setHeroClass] = useState<HeroClass>(DEFAULT_CLASS);
  const [heroes, setHeroes] = useState<HeroInstance[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedClass = localStorage.getItem('rpg_hero_class');
    if (savedClass) {
      try {
        setHeroClass(JSON.parse(savedClass));
      } catch (e) {
        console.error("Failed to parse saved class", e);
      }
    }
  }, []);

  // Save to LocalStorage
  const handleSaveClass = () => {
    localStorage.setItem('rpg_hero_class', JSON.stringify(heroClass));
    addLog(`클래스 설계도 '${heroClass.className}'가 브라우저에 저장되었습니다!`, 'info');
  };

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), message, type, timestamp: Date.now() }]);
  };

  // Scroll to bottom of logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleUpdateClass = (field: keyof HeroClass, value: any) => {
    setHeroClass(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateInstance = () => {
    if (!newInstanceName.trim()) return;
    
    const newHero: HeroInstance = {
      id: Date.now().toString(),
      name: newInstanceName,
      currentHp: heroClass.baseHp,
      maxHp: heroClass.baseHp,
      currentMp: heroClass.baseMp,
      maxMp: heroClass.baseMp,
      status: 'alive',
      className: heroClass.className,
    };

    setHeroes(prev => [...prev, newHero]);
    addLog(`새 인스턴스 생성됨: ${newInstanceName} = ${heroClass.className}("${newInstanceName}")`, 'create');
    setNewInstanceName('');
  };

  const handleCastSkill = (attackerId: string, skillIndex: number) => {
    setHeroes(prev => {
      const newHeroes = [...prev];
      const attackerIdx = newHeroes.findIndex(h => h.id === attackerId);
      if (attackerIdx === -1) return prev;

      const attacker = { ...newHeroes[attackerIdx] };
      const skill = heroClass.skills[skillIndex];

      if (attacker.status === 'dead') {
        addLog(`${attacker.name}는 이미 사망하여 행동할 수 없습니다.`, 'error');
        return prev;
      }

      if (attacker.currentMp < skill.manaCost) {
        addLog(`${attacker.name}의 마나가 부족합니다 (${skill.name} 필요 마나: ${skill.manaCost}).`, 'error');
        return prev;
      }

      // Find a random living target other than self
      const potentialTargets = newHeroes.filter(h => h.id !== attackerId && h.status === 'alive');
      if (potentialTargets.length === 0) {
        addLog(`${attacker.name}의 공격 대상이 없습니다!`, 'error');
        return prev;
      }

      const targetIdxInArray = Math.floor(Math.random() * potentialTargets.length);
      const targetId = potentialTargets[targetIdxInArray].id;
      const actualTargetIndex = newHeroes.findIndex(h => h.id === targetId);
      const target = { ...newHeroes[actualTargetIndex] };

      // Execute Skill
      attacker.currentMp -= skill.manaCost;
      target.currentHp = Math.max(0, target.currentHp - skill.damage);
      
      addLog(`${attacker.name}가 ${target.name}에게 [${skill.name}] 시전! (피해량: ${skill.damage})`, 'combat');

      if (target.currentHp === 0) {
        target.status = 'dead';
        addLog(`${target.name}가 쓰러졌습니다! (HP 0)`, 'combat');
      }

      newHeroes[attackerIdx] = attacker;
      newHeroes[actualTargetIndex] = target;

      return newHeroes;
    });
  };

  const explainWithAI = async () => {
    setIsExplaining(true);
    const text = await generateClassExplanation(heroClass.className, heroClass.skills.map(s => s.name));
    setAiExplanation(text);
    setIsExplaining(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      
      {/* LEFT COLUMN: CLASS DESIGNER */}
      <div className="lg:col-span-4 bg-white rounded-xl p-4 flex flex-col gap-4 border border-gray-200 shadow-sm overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <Zap className="w-5 h-5" /> 클래스 설계도
          </h2>
          <button 
            onClick={handleSaveClass}
            className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition text-gray-700"
          >
            <Save size={14} /> 저장
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 uppercase font-semibold">클래스 이름 (Class Name)</label>
            <input 
              type="text" 
              value={heroClass.className}
              onChange={(e) => handleUpdateClass('className', e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 uppercase font-semibold">기본 체력 (Base HP)</label>
              <input 
                type="number" 
                value={heroClass.baseHp}
                onChange={(e) => handleUpdateClass('baseHp', Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 uppercase font-semibold">기본 마나 (Base MP)</label>
              <input 
                type="number" 
                value={heroClass.baseMp}
                onChange={(e) => handleUpdateClass('baseMp', Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 uppercase font-semibold mb-2 block">보유 스킬 (Skills)</label>
            {heroClass.skills.map((skill, idx) => (
              <div key={idx} className="bg-gray-50 p-2 rounded mb-2 border border-gray-200">
                <div className="flex justify-between mb-1">
                  <input 
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = [...heroClass.skills];
                      newSkills[idx].name = e.target.value;
                      handleUpdateClass('skills', newSkills);
                    }}
                    className="bg-transparent text-sm font-bold text-indigo-600 w-1/2 focus:outline-none text-gray-900"
                  />
                  <div className="flex gap-2">
                     <span className="text-xs text-red-600">피해:{skill.damage}</span>
                     <span className="text-xs text-blue-600">마나:{skill.manaCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 border-l-2 border-indigo-500 overflow-x-auto relative group">
           <button 
             onClick={explainWithAI}
             className="absolute top-2 right-2 text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
             title="AI 선생님 설명 듣기"
           >
             <MessageSquareQuote size={16} />
           </button>
          <div className="text-gray-500"># 실시간 코드 미리보기</div>
          <div><span className="text-purple-600">class</span> <span className="text-yellow-600">{heroClass.className}</span>:</div>
          <div className="pl-4">
             <div><span className="text-purple-600">def</span> <span className="text-blue-600">__init__</span>(self, name):</div>
             <div className="pl-4">self.name = name</div>
             <div className="pl-4">self.hp = <span className="text-orange-600">{heroClass.baseHp}</span></div>
             <div className="pl-4">self.mp = <span className="text-orange-600">{heroClass.baseMp}</span></div>
          </div>
          <div className="pl-4 mt-2">
             {heroClass.skills.map(s => (
               <div key={s.name}>
                 <div><span className="text-purple-600">def</span> <span className="text-blue-600">{s.name.toLowerCase().replace(/\s/g, '_')}</span>(self, target):</div>
                 <div className="pl-4 text-gray-500"># target의 hp를 {s.damage}만큼 감소시킴</div>
               </div>
             ))}
          </div>
        </div>
        
        {aiExplanation && (
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded text-sm text-indigo-700 animate-fade-in">
             <span className="font-bold">AI 선생님:</span> {aiExplanation}
          </div>
        )}
        {isExplaining && <div className="text-xs text-indigo-600 animate-pulse">AI가 코드를 분석 중입니다...</div>}
      </div>

      {/* CENTER & RIGHT: INSTANCE FACTORY & BATTLEFIELD */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Creation Controls */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 font-mono text-lg">{heroClass.className}</span>
            <span className="text-gray-500">factory = </span>
          </div>
          <div className="flex-1 flex gap-2">
            <input 
              type="text"
              placeholder='이름 입력 (예: "Gandalf")'
              value={newInstanceName}
              onChange={(e) => setNewInstanceName(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:border-emerald-500 focus:outline-none text-gray-900"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateInstance()}
            />
            <button 
              onClick={handleCreateInstance}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition"
            >
              <Plus size={18} /> 생성하기 (Instantiate)
            </button>
          </div>
        </div>

        {/* Battlefield / Object Container */}
        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-y-auto relative min-h-[300px]">
          {heroes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <RefreshCw size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-gray-600">생성된 인스턴스가 없습니다.</p>
                <p className="text-sm text-gray-500">위의 '생성하기' 버튼으로 설계도를 이용해 실제 캐릭터를 만드세요.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {heroes.map((hero) => (
                <div key={hero.id} className={`relative bg-white rounded-lg p-4 border-2 transition-all duration-300 ${hero.status === 'dead' ? 'border-red-300 opacity-60 grayscale' : 'border-emerald-200 hover:border-emerald-400 shadow-md'}`}>
                  {hero.status === 'dead' && (
                    <div className="absolute top-2 right-2 text-red-500">
                      <Skull size={20} />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{hero.name}</h3>
                      <span className="text-xs text-gray-500 font-mono">&lt;{hero.className}&gt;</span>
                    </div>
                    <div className="text-xs font-mono text-gray-400">ID: {hero.id.slice(-4)}</div>
                  </div>

                  {/* HP Bar */}
                  <div className="mb-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-red-600 font-bold">HP</span>
                      <span className="text-gray-600">{hero.currentHp}/{hero.maxHp}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500 h-full transition-all duration-500" 
                        style={{ width: `${(hero.currentHp / hero.maxHp) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                   {/* MP Bar */}
                   <div className="mb-4">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-blue-600 font-bold">MP</span>
                      <span className="text-gray-600">{hero.currentMp}/{hero.maxMp}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-500" 
                        style={{ width: `${(hero.currentMp / hero.maxMp) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 gap-2">
                    {heroClass.skills.map((skill, sIdx) => (
                      <button
                        key={sIdx}
                        disabled={hero.status === 'dead' || hero.currentMp < skill.manaCost}
                        onClick={() => handleCastSkill(hero.id, sIdx)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 py-1.5 px-3 rounded flex justify-between items-center transition border border-gray-200"
                      >
                        <span>{skill.name}</span>
                        <span className="text-blue-600 font-mono">-{skill.manaCost} MP</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Console Logs */}
        <div className="h-40 bg-gray-900 rounded-xl border border-gray-700 p-2 font-mono text-xs overflow-y-auto" ref={scrollRef}>
           {logs.length === 0 && <div className="text-gray-500 italic p-2">시스템 준비 완료... 입력을 기다리는 중.</div>}
           {logs.map((log) => (
             <div key={log.id} className="mb-1 animate-fade-in-up">
               <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
               <span className={`ml-2 ${
                 log.type === 'create' ? 'text-green-400' :
                 log.type === 'combat' ? 'text-yellow-400' :
                 log.type === 'error' ? 'text-red-400' :
                 'text-blue-300'
               }`}>
                 {log.message}
               </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;