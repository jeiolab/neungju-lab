import React from 'react';
import { Network, Trophy, Menu } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  score: number;
  progress: number;
  currentView: ViewState;
}

export const Layout: React.FC<LayoutProps> = ({ children, score, progress, currentView }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Network className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">NetMaster</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-700 text-sm">{score} 점</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl px-4 py-8 flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};