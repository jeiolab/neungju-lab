import React, { useState, useEffect } from 'react';
import { GameState, TechType, ReasonType, NoteItem } from './types';
import { questions } from './data';
import StartScreen from './components/StartScreen';
import Header from './components/Header';
import GameCard from './components/GameCard';
import ResultModal from './components/ResultModal';
import NoteView from './components/NoteView';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'start' | 'game' | 'notes'>('start');

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
    // +15 per correct reason found in the answer key, capped at 30 total for reasons.
    const correctReasonMatches = selectedReasons.filter(r => currentQuestion.correctReasons.includes(r)).length;
    // If tech is wrong, we limit reason points to avoid high scores on wrong answers? 
    // Prompt says: "Tech 70, Reason match max 30". It implies additive.
    // Let's implement strictly: Tech correct = 70. Reasons match key = +points.
    
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

  // Views
  if (view === 'start') {
    return <StartScreen onStart={() => setView('game')} />;
  }

  if (view === 'notes') {
    return (
      <NoteView 
        notes={gameState.history} 
        onBack={() => setView('game')} 
        onDelete={handleDeleteNote}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Header level={gameState.level} xp={gameState.totalScore} streak={gameState.streak} />
      
      <GameCard
        question={currentQuestion}
        selectedTech={selectedTech}
        selectedReasons={selectedReasons}
        onSelectTech={handleSelectTech}
        onToggleReason={handleToggleReason}
        onSubmit={handleSubmit}
      />

      {/* Floating Note Button */}
      <button 
        onClick={() => setView('notes')}
        className="fixed bottom-6 right-6 bg-white text-indigo-600 p-4 rounded-full shadow-xl border border-indigo-100 hover:scale-110 transition-transform z-40"
      >
        <BookOpen className="w-6 h-6" />
      </button>

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
  );
};

export default App;