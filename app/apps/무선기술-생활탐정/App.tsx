import React, { useState, useEffect } from 'react';
import { GameState, TechType, ReasonType, NoteItem } from './types';
import { questions } from './data';
import Header from './components/Header';
import GameCard from './components/GameCard';
import ResultModal from './components/ResultModal';
import NoteView from './components/NoteView';
import { BookOpen, Gamepad2, PenTool } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'game' | 'notes'>('game');

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    totalScore: 0, // Used as XP
    streak: 0,
    level: 1,
    history: []
  });

  // Round State
  const [selectedTech, setSelectedTech] = useState<TechType | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<ReasonType[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [isRoundCorrect, setIsRoundCorrect] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Derived State
  const currentQuestion = questions[gameState.currentQuestionIndex];

  // Logic: Handle Tech Selection
  const handleSelectTech = (tech: TechType) => {
    setSelectedTech(tech);
  };

  // Logic: Handle Reason Toggling (Max 2)
  const handleToggleReason = (reason: ReasonType) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      if (selectedReasons.length < 2) {
        setSelectedReasons([...selectedReasons, reason]);
      }
    }
  };

  // Logic: Submit Answer
  const handleSubmit = () => {
    if (!selectedTech) return;

    let score = 0;
    
    // 1. Tech Check (70 pts)
    const isTechCorrect = selectedTech === currentQuestion.correctTech;
    if (isTechCorrect) score += 70;

    // 2. Reason Check (Max 30 pts)
    const correctReasonMatches = selectedReasons.filter(r => currentQuestion.correctReasons.includes(r)).length;
    const reasonPoints = Math.min(30, correctReasonMatches * 15);
    score += reasonPoints;

    setRoundScore(score);
    setIsRoundCorrect(isTechCorrect);
    
    // Update Global Stats
    setGameState(prev => {
      const newStreak = isTechCorrect ? prev.streak + 1 : 0;
      const newXP = prev.totalScore + score + (newStreak > 2 ? 10 : 0); // Bonus for streak
      const newLevel = Math.floor(newXP / 300) + 1;

      return {
        ...prev,
        score: score,
        totalScore: newXP,
        streak: newStreak,
        level: newLevel
      };
    });

    setShowResult(true);
    setIsSaved(false); // Reset save state
  };

  // Logic: Next Question
  const handleNext = () => {
    setShowResult(false);
    setSelectedTech(null);
    setSelectedReasons([]);
    
    setGameState(prev => {
      // Loop back to 0 if end of questions (Demo mode)
      const nextIndex = (prev.currentQuestionIndex + 1) % questions.length;
      return {
        ...prev,
        currentQuestionIndex: nextIndex
      };
    });
  };

  // Logic: Save to Note
  const handleSaveNote = () => {
    const newNote: NoteItem = {
      id: Date.now(),
      questionId: currentQuestion.id,
      scenario: currentQuestion.scenario,
      correctTech: currentQuestion.correctTech,
      userTech: selectedTech,
      isCorrect: isRoundCorrect,
      explanation: currentQuestion.explanation,
      tip: currentQuestion.tip,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      history: [newNote, ...prev.history]
    }));
    setIsSaved(true);
  };

  // Logic: Delete Note
  const handleDeleteNote = (id: number) => {
    setGameState(prev => ({
      ...prev,
      history: prev.history.filter(note => note.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Gamepad2 size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">무선기술 생활탐정</h1>
              <p className="text-xs text-slate-500">상황에 맞는 기술을 찾아라!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">LEVEL</div>
              <div className="font-bold text-indigo-600">Lv.{gameState.level}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">XP</div>
              <div className="font-bold text-indigo-600">{gameState.totalScore}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">STREAK</div>
              <div className="font-bold text-indigo-600">{gameState.streak}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                activeTab === 'game' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Gamepad2 size={18} /> 게임
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                activeTab === 'notes' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen size={18} /> 노트
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {activeTab === 'game' && (
          <div className="relative">
            <GameCard
              question={currentQuestion}
              selectedTech={selectedTech}
              selectedReasons={selectedReasons}
              onSelectTech={handleSelectTech}
              onToggleReason={handleToggleReason}
              onSubmit={handleSubmit}
            />

            {showResult && (
              <ResultModal
                question={currentQuestion}
                userTech={selectedTech}
                score={roundScore}
                isCorrect={isRoundCorrect}
                onNext={handleNext}
                onSaveNote={handleSaveNote}
                isSaved={isSaved}
              />
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <NoteView 
            notes={gameState.history} 
            onBack={() => setActiveTab('game')} 
            onDelete={handleDeleteNote}
          />
        )}
      </main>
    </div>
  );
};

export default App;