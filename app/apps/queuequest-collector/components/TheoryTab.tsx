import React from 'react';
import { THEORY_CARDS } from '../constants';
import { UserProfile } from '../types';
import { calculateXP, saveProfile } from '../utils';
import { Check, X, HelpCircle, BookOpen } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const TheoryTab: React.FC<Props> = ({ profile, setProfile }) => {
  const toggleMastery = (cardId: string, value: number) => {
    const newMastery = { ...profile.mastery, [cardId]: value };
    let xpGain = value > profile.mastery[cardId] ? 10 : 0; // Gain XP only on first mastery
    
    // Check if newMastery is undefined, default to empty object
    const currentMasteryVal = profile.mastery[cardId] || 0;
    if (value > currentMasteryVal) {
        xpGain = 10;
    } else {
        xpGain = 0;
    }
    
    const newProfile = calculateXP({ ...profile, mastery: newMastery }, xpGain);
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
            <BookOpen size={20} />
        </div>
        <div>
            <h3 className="font-bold text-blue-800">빅데이터 수집의 핵심</h3>
            <p className="text-sm text-blue-700 mt-1">
                문제 해결을 위해서는 <strong>적절한 데이터</strong>를 <strong>올바른 방법</strong>으로 모으는 것이 가장 중요합니다. 아래 카드들을 학습하고 이해도를 체크해보세요!
            </p>
        </div>
      </div>

      {THEORY_CARDS.map(card => {
        const isMastered = (profile.mastery[card.id] || 0) === 100;

        return (
            <div key={card.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 transition-all ${isMastered ? 'border-green-500' : 'border-indigo-500'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-slate-800">{card.title}</h2>
                        {isMastered && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><Check size={12}/> 학습완료</span>}
                    </div>
                    
                    <p className="text-slate-600 mb-4 font-medium">{card.definition}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {card.keywords.map(k => (
                            <span key={k} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">#{k}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <span className="font-bold text-indigo-600 block mb-1">💡 예시</span>
                            {card.example}
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg">
                             <span className="font-bold text-amber-600 block mb-1">⚠️ 흔한 오해</span>
                             <span className="line-through text-slate-400 mr-2">{card.misconception}</span>
                             <br/>
                             <span className="text-amber-800">→ {card.correction}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <HelpCircle size={16} className="text-indigo-500" />
                            <span className="text-sm font-bold text-slate-700">10초 체크: {card.checkQuestion}</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => toggleMastery(card.id, 100)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2 ${isMastered ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-600'}`}
                            >
                                <Check size={16} /> 이해했어요
                            </button>
                            <button 
                                onClick={() => toggleMastery(card.id, 50)}
                                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-amber-50 hover:text-amber-600 transition flex justify-center items-center gap-2"
                            >
                                <HelpCircle size={16} /> 헷갈려요
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
      })}
    </div>
  );
};

export default TheoryTab;