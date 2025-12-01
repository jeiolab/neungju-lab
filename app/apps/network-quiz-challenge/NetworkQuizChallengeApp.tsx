'use client'

import React, { useState } from 'react';
import { QuizSessionState, QuizSettings, UserAnswer } from './types';
import { generateQuiz } from './services/geminiService';
import { SetupScreen } from './components/SetupScreen';
import { QuizScreen } from './components/QuizScreen';
import { ReportScreen } from './components/ReportScreen';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const INITIAL_STATE: QuizSessionState = {
  questions: [],
  answers: [],
  currentIndex: 0,
  score: 0,
  status: 'SETUP',
};

const NetworkQuizChallengeApp: React.FC = () => {
  const [session, setSession] = useState<QuizSessionState>(INITIAL_STATE);

  const startQuiz = async (settings: QuizSettings) => {
    setSession(prev => ({ ...prev, status: 'LOADING' }));
    
    try {
      const questions = await generateQuiz(settings);
      setSession({
        questions,
        answers: [],
        currentIndex: 0,
        score: 0,
        status: 'QUIZ',
      });
    } catch (error) {
      console.error("Failed to start quiz", error);
      alert("문제를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setSession(prev => ({ ...prev, status: 'SETUP' }));
    }
  };

  const handleAnswer = (userInput: string, isCorrect: boolean) => {
    const currentQuestion = session.questions[session.currentIndex];
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      userInput,
      isCorrect,
      timestamp: Date.now()
    };

    setSession(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
      score: isCorrect ? prev.score + 10 : prev.score
    }));
  };

  const nextQuestion = () => {
    if (session.currentIndex < session.questions.length - 1) {
      setSession(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
    } else {
      setSession(prev => ({
        ...prev,
        status: 'REPORT'
      }));
    }
  };

  const resetQuiz = () => {
    setSession(INITIAL_STATE);
  };

  const retryWithSameSettings = () => {
    resetQuiz();
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {session.status === 'SETUP' && (
          <SetupScreen onStart={startQuiz} isLoading={false} />
        )}

        {session.status === 'LOADING' && (
           <SetupScreen onStart={() => {}} isLoading={true} />
        )}

        {session.status === 'QUIZ' && session.questions.length > 0 && (
          <QuizScreen 
            question={session.questions[session.currentIndex]}
            currentIndex={session.currentIndex}
            totalCount={session.questions.length}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
            currentScore={session.score}
          />
        )}

        {session.status === 'REPORT' && (
          <ReportScreen 
            answers={session.answers}
            questions={session.questions}
            onRetry={retryWithSameSettings}
            onHome={resetQuiz}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default NetworkQuizChallengeApp;

