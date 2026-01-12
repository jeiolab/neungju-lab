'use client'

import React from 'react'
import SmartRandomPairMatcher from './components/SmartRandomPairMatcher'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

const SmartPairingApp: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full flex-grow">
        <SmartRandomPairMatcher />
      </main>
      <Footer />
    </div>
  )
}

export default SmartPairingApp

