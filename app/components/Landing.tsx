'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Landing() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-[#f5f9fa]">
      {/* Main Content */}
      <div className="container mx-auto flex flex-col md:flex-row w-full h-full">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex items-center justify-center"
        >
          <div>
            <h1 className="text-8xl md:text-9xl font-bold mb-6 tracking-wider drop-shadow-lg">
              <span className="bg-gradient-to-r from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] bg-clip-text text-transparent">
                THE GOOD PLACE
              </span>
            </h1>
            <p className="text-gray-800 text-lg max-w-lg mb-8">
              Your lovely ones will be remembered. All the memorals are stored internally.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-[80vh] h-auto"
        >
          <Image
            src="/landing.png"
            alt="Memorial Portrait"
            fill
            className="object-contain md:object-cover object-center"
            priority
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-8 h-12 border-2 border-gray-500 rounded-full flex justify-center bg-white/50">
          <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>

      {/* Decorative Birds */}
      {/* <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute top-20 right-20 z-0"
      >
        <Image 
          src="/birds.png" 
          alt="Flying Birds" 
          width={200} 
          height={100}
          className="opacity-60"
        />
      </motion.div> */}
    </section>
  )
}