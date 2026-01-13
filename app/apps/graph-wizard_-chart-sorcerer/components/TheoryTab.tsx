import React from 'react';
import { motion } from 'framer-motion';
import { THEORY_DATA } from '../constants';

const TheoryTab: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          시각화 도감 (Visualization Codex)
        </h2>
        <p className="text-slate-400">데이터의 성격에 맞는 마법 도구를 배워보세요.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {THEORY_DATA.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-purple-500 transition-all cursor-pointer group shadow-lg shadow-purple-900/10"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-purple-300 mb-2">{item.type}</h3>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              {item.purpose}
            </p>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              {item.desc}
            </p>
            <div className="mt-auto pt-4 border-t border-slate-700">
              <span className="text-xs text-purple-400 font-mono">Spell: {item.magicSpell}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TheoryTab;
