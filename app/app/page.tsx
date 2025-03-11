'use client'

import { useState, useEffect, Suspense } from 'react'
import Satements from '@/components/statements'
import BigStatement from '@/components/BigStatement'
import Hero2 from '@/components/Hero2'
import Demo from '@/components/Demo'
import Features from '@/components/Features'
import NavBar from '@/components/NavBar'
import Partner from '@/components/Partner'
import Starters from '@/components/Starters'
import WhatNew from '@/components/whatNew'
import Footer from '@/components/Footer'
import Landing from '@/components/Landing'
import Head from 'next/head'
import ChatSimulator from '@/components/ChatSimulator'
import { WalletConnectionProvider } from './utils/Walletcontext'
import CrystallViewer from '@/components/models/mainModel'
import Roadmap from '@/components/roadMap'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <WalletConnectionProvider>
      <Suspense fallback={<div className="bg-black text-gray-200">Loading...</div>}>
        <main className="bg-black min-h-screen relative text-gray-200">
          <title>TheGoodPlace - Build Founder Conviction Before Code</title>
          <NavBar />
          <Landing />
          <Partner />
          <div className=' bg-black'>
          <CrystallViewer />
          </div>
          <Roadmap />
          {/* <ChatSimulator /> */}
          <Footer />
          {/* <Features /> */}
          {/* <Starters /> */}
        </main>
      </Suspense>
    </WalletConnectionProvider>
  )
}