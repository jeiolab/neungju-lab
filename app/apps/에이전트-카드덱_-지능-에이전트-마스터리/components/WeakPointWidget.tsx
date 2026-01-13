import React from 'react';
import { UserProfile, ConceptCard } from '../types';
import { CONCEPT_CARDS } from '../constants';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onSelectCard: (id: string) => void;
}

const WeakPointWidget: React.FC<Props> = ({ profile, onSelectCard }) => {
  // Find concepts with mastery < 60, sorted by lowest
  const weakPoints = (Object.entries(profile.mastery) as [string, number][])
    .filter(([_, score]) => score < 60)
    .sort((a, b) => a[1] - b[1])
    .map(([id]) => CONCEPT_CARDS.find((c) => c.id === id))
    .filter((c): c is ConceptCard => !!c)
    .slice(0, 2); // Top 2

  if (weakPoints.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h3 className="font-bold text-red-700">집중 케어 필요!</h3>
      </div>
      <div className="space-y-2">
        {weakPoints.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelectCard(card.id)}
            className="w-full flex justify-between items-center bg-white p-3 rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div>
              <span className="text-sm font-semibold text-gray-700 block">{card.title}</span>
              <span className="text-xs text-red-500">마스터리: {profile.mastery[card.id]}%</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeakPointWidget;