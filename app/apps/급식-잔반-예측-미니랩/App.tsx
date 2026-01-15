import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Simulation from './pages/Simulation';
import Concepts from './pages/Concepts';
import Quiz from './pages/Quiz';
import Reflection from './pages/Reflection';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;