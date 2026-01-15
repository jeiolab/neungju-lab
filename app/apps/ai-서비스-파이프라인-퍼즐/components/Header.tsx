import React from 'react';
import { UserState } from '../types';
import { Trophy, Flame, Star, Activity } from 'lucide-react';

interface HeaderProps {
    userState: UserState;
}

export const Header: React.FC<HeaderProps> = ({ userState }) => {
    return (
        <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-8 h-8 text-yellow-300" />
                    <h1 className="text-xl font-bold tracking-tight">AI 서비스 파이프라인 퍼즐</h1>
                </div>
                
                <div className="flex gap-6 text-sm font-medium bg-indigo-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <div className="flex items-center gap-1.5" title="레벨">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>Lv. {userState.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="연속 학습일">
                        <Flame className="w-4 h-4 text-orange-400 fill-current" />
                        <span>{userState.streak}일 연속</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="획득 배지">
                        <Trophy className="w-4 h-4 text-sky-300" />
                        <span>{userState.badges.length}개</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
