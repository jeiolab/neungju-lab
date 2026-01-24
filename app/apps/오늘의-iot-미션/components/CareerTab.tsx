import React, { useState } from 'react';
import { CareerCard } from '../types';
import { Briefcase, CheckSquare, TrendingUp } from 'lucide-react';

interface CareerTabProps {
  careers: CareerCard[];
}

const CareerTab: React.FC<CareerTabProps> = ({ careers }) => {
  const [selectedCareer, setSelectedCareer] = useState<CareerCard>(careers[0]);
  const [checkedSkills, setCheckedSkills] = useState<Set<string>>(new Set());

  const toggleSkill = (skill: string) => {
    const newSet = new Set(checkedSkills);
    if (newSet.has(skill)) {
      newSet.delete(skill);
    } else {
      newSet.add(skill);
    }
    setCheckedSkills(newSet);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Career List */}
        <div className="space-y-3">
          {careers.map((career) => (
            <button
              key={career.id}
              onClick={() => setSelectedCareer(career)}
              className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                selectedCareer.id === career.id
                  ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-100'
                  : 'border-transparent bg-white/50 hover:bg-white text-gray-600'
              }`}
            >
              <div className="font-bold text-gray-800">{career.title}</div>
              <div className="text-xs text-gray-500 truncate">{career.description}</div>
            </button>
          ))}
        </div>

        {/* Detail View */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedCareer.title}</h2>
                <p className="text-sm text-gray-500">미래 유망 직업</p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6 border-b border-gray-100 pb-6">
              {selectedCareer.description}
            </p>

            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              필요 역량 체크리스트 (나의 로드맵)
            </h3>
            <div className="space-y-3">
              {selectedCareer.requiredSkills.map((skill, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleSkill(skill)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    checkedSkills.has(skill) ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                    checkedSkills.has(skill) ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'
                  }`}>
                    {checkedSkills.has(skill) && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`${checkedSkills.has(skill) ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-xs text-gray-400 text-center">
              * 체크한 역량은 브라우저에 저장되어 나만의 포트폴리오가 됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTab;
