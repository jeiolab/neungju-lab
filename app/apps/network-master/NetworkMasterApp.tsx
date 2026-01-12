'use client'

import React, { useState } from 'react';
import { ViewState } from './types';
import { Intro } from './components/Intro';
import { ConceptTabs } from './components/ConceptTabs';
import { SimulationGame } from './components/SimulationGame';
import { ReviewQuiz } from './components/ReviewQuiz';
import { Layout } from './components/Layout';
import { Result } from './components/Result';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function NetworkMasterApp() {
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

  const handleHomeClick = () => {
    setScore(0);
    setProgress(0);
    setCurrentView('INTRO');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          <Layout score={score} progress={progress} currentView={currentView} onHomeClick={handleHomeClick}>
            {currentView === 'INTRO' && <Intro onStart={handleStart} />}
            {currentView === 'CONCEPTS' && <ConceptTabs onComplete={handleConceptsComplete} />}
            {currentView === 'SIMULATION' && <SimulationGame onComplete={handleSimulationComplete} />}
            {currentView === 'QUIZ' && <ReviewQuiz onComplete={handleQuizComplete} />}
            {currentView === 'RESULT' && <Result score={score} onRestart={handleRestart} />}
          </Layout>
        </div>
      </main>
      <Footer />
    </div>
  );
}