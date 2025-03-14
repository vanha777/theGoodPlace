'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaRocket, FaUsers, FaMobileAlt, FaGlobe } from 'react-icons/fa'

export default function Roadmap() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const milestones = [
    { id: 1, title: "Submission to Sonic Blockchain", date: "Q1 2025", description: "Preserve all data permanently on the Sonic Blockchain.", icon: FaRocket },
    { id: 2, title: "Enhance Interaction", date: "Q2 2025", description: "Add sharing capabilities and interactive features such as voice and social media post integration.", icon: FaUsers },
    { id: 3, title: "Mobile App", date: "Q3 2025", description: "Launch native mobile applications for iOS and Android.", icon: FaMobileAlt },
    { id: 4, title: "Community Features", date: "Q4 2025", description: "", icon: FaGlobe }
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
        {!isMobile && (
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] rounded-full"></div>
        )}

        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`flex ${isMobile ? 'flex-col mb-16' : 'mb-24'} relative`}
          >
            {!isMobile && (
              <div className={`flex w-full items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-12' : 'pl-12'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="mr-3 bg-blue-50 p-2 rounded-full">
                        <milestone.icon size={24} color="#3b82f6" />
                      </div>
                      <span className="text-sm font-semibold text-blue-500">{milestone.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-400 z-10"></div>
              </div>
            )}

            {isMobile && (
              <div className="flex flex-col w-full">
                <div className="flex items-center mb-3">
                  <div className="mr-3 bg-blue-50 p-2 rounded-full">
                    <milestone.icon size={24} color="#3b82f6" />
                  </div>
                  <span className="text-sm font-semibold text-blue-500">{milestone.date}</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Join Us On This Journey</h3>
        <button className="px-8 py-3 bg-gradient-to-r from-[#00ffe1] to-[#00a3ff] text-white font-medium rounded-full hover:shadow-lg transition-shadow">
          Subscribe for Updates
        </button>
      </motion.div>
    </section>
  )
}