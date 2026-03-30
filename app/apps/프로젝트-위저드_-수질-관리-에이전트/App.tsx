'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PRACTICE_CATALOG_HREF } from '@/lib/routes'
import { BookOpen, Wand2, Play, HelpCircle, MessageSquare, Home } from 'lucide-react'
import { AgentDesign } from './types'
import Wizard from './components/Wizard'
import Theory from './components/Theory'
import Simulation from './components/Simulation'
import Quiz from './components/Quiz'
import Reflection from './components/Reflection'

const STORAGE_KEY = 'water_agent_design_v1'

const defaultDesign: AgentDesign = {
  name: '',
  perception: {
    sensors: [],
    dataTypes: [],
    location: '',
  },
  analysis: {
    threshold: '',
    logic: '',
  },
  reasoning: {
    decision: '',
    strategy: '',
  },
  action: {
    actuators: [],
    feedback: '',
  },
  characteristics: [],
}

const tabs = [
  { id: 'theory', label: '개념', icon: BookOpen },
  { id: 'wizard', label: '설계', icon: Wand2 },
  { id: 'simulation', label: '시뮬레이션', icon: Play },
  { id: 'quiz', label: '퀴즈', icon: HelpCircle },
  { id: 'reflection', label: '성찰', icon: MessageSquare },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('theory')
  const [design, setDesign] = useState<AgentDesign>(() => {
    if (typeof window === 'undefined') return defaultDesign
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultDesign
  })
  const [wizardComplete, setWizardComplete] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(design))
  }, [design])

  const renderContent = () => {
    switch (activeTab) {
      case 'theory':
        return <Theory />
      case 'wizard':
        return (
          <Wizard
            savedDesign={design}
            onSave={setDesign}
            onComplete={() => setWizardComplete(true)}
          />
        )
      case 'simulation':
        return <Simulation onRun={() => {}} />
      case 'quiz':
        return <Quiz onScoreUpdate={(s: number) => setQuizScore(s)} />
      case 'reflection':
        return <Reflection />
      default:
        return <Theory />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href={PRACTICE_CATALOG_HREF}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">홈</span>
            </Link>
            <h1 className="text-lg font-bold text-slate-900">프로젝트 위저드: 수질 관리 에이전트</h1>
            <div className="w-20" />
          </div>
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
