'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Roadmap() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sample roadmap data - replace with your actual milestones
  const milestones = [
    {
      id: 1,
      title: "Platform Launch",
      date: "Q1 2024",
      description: "Initial release of The Good Place memorial platform",
      icon: "/icons/launch.svg",
    },
    {
      id: 2,
      title: "Community Features",
      date: "Q2 2024",
      description: "Adding sharing capabilities and community interactions",
      icon: "/icons/community.svg",
    },
    {
      id: 3,
      title: "Mobile App",
      date: "Q3 2024",
      description: "Native mobile applications for iOS and Android",
      icon: "/icons/mobile.svg",
    },
    {
      id: 4,
      title: "Global Expansion",
      date: "Q4 2024",
      description: "Supporting multiple languages and regional customs",
      icon: "/icons/global.svg",
    },
  ]

  return (
    <section className="relative py-20 overflow-hidden min-h-screen flex flex-col items-center bg-[#f5f9fa]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] bg-clip-text text-transparent">
            Our Journey
          </span>
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          The roadmap for The Good Place - how we're building a better way to remember loved ones
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="container mx-auto relative">
        {/* Vertical line for desktop */}
        {!isMobile && (
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] rounded-full"></div>
        )}

        {/* Milestones */}
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`flex ${isMobile ? 'flex-col mb-16' : 'mb-24'} relative`}
          >
            {/* For desktop: alternate left and right */}
            {!isMobile && (
              <div className={`flex w-full items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-12' : 'pl-12'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-3">
                      {milestone.icon && (
                        <div className="mr-3 bg-blue-50 p-2 rounded-full">
                          <Image src={milestone.icon} alt="" width={24} height={24} />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-blue-500">{milestone.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-400 z-10"></div>
              </div>
            )}

            {/* For mobile: stacked vertically */}
            {isMobile && (
              <div className="flex flex-col w-full">
                <div className="flex items-center mb-3">
                  <div className="mr-3 bg-blue-50 p-2 rounded-full">
                    {milestone.icon && <Image src={milestone.icon} alt="" width={24} height={24} />}
                  </div>
                  <span className="text-sm font-semibold text-blue-500">{milestone.date}</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <h3 className="text-2xl font-semibold mb-4">Join Us On This Journey</h3>
        <button className="px-8 py-3 bg-gradient-to-r from-[#00ffe1] to-[#00a3ff] text-white font-medium rounded-full hover:shadow-lg transition-shadow">
          Subscribe for Updates
        </button>
      </motion.div>
    </section>
  )
}