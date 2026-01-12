'use client'

import React from 'react';
import { Concept } from './components/Concept';
import { Visualizer } from './components/Visualizer';
import { LearnMore } from './components/LearnMore';
import { Quiz } from './components/Quiz';
import { Discussion } from './components/Discussion';
import { ArrowDown } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
          인터넷의 주소가<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            진화하고 있습니다
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 animate-fade-in-up delay-200">
          43억 개의 <strong>IPv4</strong> 주소가 고갈되고 있습니다. <br className="hidden sm:block"/>
          무한대에 가까운 <strong>IPv6</strong>가 왜 필요한지, 무엇이 다른지 지금 바로 알아보세요.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
          <button 
            onClick={() => {
              document.getElementById('concept')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
          >
            시작하기
            <ArrowDown size={20} />
          </button>
        </div>
      </div>
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default function AddressRevolutionApp() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full flex-grow">
        <Hero />
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Concept />
          <Visualizer />
          <LearnMore />
          <Quiz />
          <Discussion />
        </div>
      </main>
      <Footer />
    </div>
  );
}