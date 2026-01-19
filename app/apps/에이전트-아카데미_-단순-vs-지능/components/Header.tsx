import React, { useState } from 'react';
import { UserStats, Badge } from '../types';
import { BADGES } from '../constants';
import { Trophy, Flame, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const [showBadges, setShowBadges] = useState(false);

  const BadgeIconRenderer = ({ name, unlocked }: { name: string, unlocked: boolean }) => {
    let IconComp = Icons.Star;
    if (name === 'flame') IconComp = Icons.Flame;
    if (name === 'trophy') IconComp = Icons.Trophy;
    if (name === 'book') IconComp = Icons.Book;

    return <IconComp size={20} className={unlocked ? 'text-yellow-500' : 'text-gray-300'} />;
  };

  return (
    <>
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 shadow-sm flex items-center justify-between md:justify-end">
      {/* Mobile Title (shown only on small screens) */}
      <div className="flex md:hidden items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Icons.Bot size={20} />
          </div>
          <span className="font-bold text-gray-800">에이전트 스쿨</span>
      </div>

      <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
              <Flame size={16} className="text-orange-500 fill-orange-500" />
              <span className="font-bold text-orange-700 text-sm">{stats.streakDays}일 연속</span>
          </div>

          <button 
              onClick={() => setShowBadges(true)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full"
          >
              <Trophy size={16} className="text-gray-600" />
              <span className="font-bold text-gray-700 text-sm">업적</span>
          </button>
      </div>
    </header>

    <AnimatePresence>
        {showBadges && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowBadges(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">나의 업적</h2>
                        <button onClick={() => setShowBadges(false)} className="p-1 hover:bg-gray-100 rounded-full">
                            <Icons.X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {BADGES.map((badge) => {
                            const isUnlocked = badge.condition(stats);
                            return (
                                <div key={badge.id} className={`flex items-center gap-4 p-3 rounded-xl border ${isUnlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                    <div className={`p-2 rounded-full ${isUnlocked ? 'bg-white shadow-sm' : 'bg-gray-200'}`}>
                                        <BadgeIconRenderer name={badge.icon} unlocked={isUnlocked} />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>{badge.name}</h4>
                                        <p className="text-xs text-gray-500">{badge.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
};

export default Header;