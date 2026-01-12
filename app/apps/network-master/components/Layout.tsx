import React from 'react';
import { Network, Trophy, Menu } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  score: number;
  progress: number;
  currentView: ViewState;
  onHomeClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, score, progress, currentView, onHomeClick }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 mb-6 pb-4">
        <div className="flex items-center justify-between">
          {onHomeClick ? (
            <button 
              onClick={onHomeClick} 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">유무선 네트워크 완전 정복</h1>
                <p className="text-sm text-slate-500 leading-tight mt-0.5">유선 및 무선 네트워크 개념 학습, 시뮬레이션 게임, 그리고 퀴즈를 포함한 인터랙티브 교육 웹 앱입니다.</p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">유무선 네트워크 완전 정복</h1>
                <p className="text-sm text-slate-500 leading-tight mt-0.5">유선 및 무선 네트워크 개념 학습, 시뮬레이션 게임, 그리고 퀴즈를 포함한 인터랙티브 교육 웹 앱입니다.</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-700 text-sm">{score} 점</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full h-1 bg-slate-100 rounded-full mt-4">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="w-full max-w-2xl px-4 py-8 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};