import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TheorySection from './components/TheorySection';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import { ViewState } from './types';

function App() {
  const [currentView, setView] = useState<ViewState>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStart={() => setView('theory')} />;
      case 'theory':
        return <TheorySection />;
      case 'simulation':
        return <Simulation />;
      case 'quiz':
        return <Quiz />;
      case 'reflection':
        return <Reflection />;
      default:
        return <Dashboard onStart={() => setView('theory')} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderContent()}
    </Layout>
  );
}

export default App;