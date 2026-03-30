import React, { useState } from 'react';
import { ViewState } from './types';
import { Intro } from './components/Intro';
import { ConceptTabs } from './components/ConceptTabs';
import { SimulationGame } from './components/SimulationGame';
import { ReviewQuiz } from './components/ReviewQuiz';
import { Layout } from './components/Layout';
import { Result } from './components/Result';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('INTRO');
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    setCurrentView('CONCEPTS');
    setProgress(25);
  };

  const handleConceptsComplete = () => {
    setCurrentView('SIMULATION');
    setProgress(50);
  };

  const handleSimulationComplete = (points: number) => {
    setScore(prev => prev + points);
    setCurrentView('QUIZ');
    setProgress(75);
  };

  const handleQuizComplete = (points: number) => {
    setScore(prev => prev + points);
    setCurrentView('RESULT');
    setProgress(100);
  };

  const handleRestart = () => {
    setScore(0);
    setProgress(0);
    setCurrentView('INTRO');
  };

  return (
    <Layout score={score} progress={progress} currentView={currentView}>
      {currentView === 'INTRO' && <Intro onStart={handleStart} />}
      {currentView === 'CONCEPTS' && <ConceptTabs onComplete={handleConceptsComplete} />}
      {currentView === 'SIMULATION' && <SimulationGame onComplete={handleSimulationComplete} />}
      {currentView === 'QUIZ' && <ReviewQuiz onComplete={handleQuizComplete} />}
      {currentView === 'RESULT' && <Result score={score} onRestart={handleRestart} />}
    </Layout>
  );
}