'use client'

import { motion } from 'framer-motion'

export default function TheGoodPlace() {
  const pinpoints = [
    {
      "question": "What if their voice could stay with you forever?",
      "description": "Preserve every laugh, piece of wisdom, and comforting word in a digital sanctuary that never fades."
    },
    {
      "question": "Do you miss their jokes and wish you could hear them again?",
      "description": "Archive every punchline and whimsical comment—revisit those joyful moments whenever you need a lift."
    },
    {
      "question": "What about their legacy?",
      "description": "A life doesn't end when someone passes away. Transform fleeting memories into an everlasting keepsake, just a tap away."
    },
    {
      "question": "What is TheGoodPlace all about?",
      "description": "We stand against social platforms that erase a loved one’s digital footprint, ensuring their memory remains alive."
    }
  ]


  return (
    <section className="bg-black via-gray-800 to-gray-900 relative overflow-hidden py-24">
      {/* Background blurs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#00ffe1] to-[#00a3ff] rounded-full filter blur-[120px] opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#00ffe1] to-[#00a3ff] rounded-full filter blur-[120px] opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] bg-clip-text text-transparent">
              Keep Them Close, Forever
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            TheGoodPlace lets you hold onto the ones you love—digitally, eternally, effortlessly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {pinpoints.map((pinpoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-[#00d9ff] mb-2">{pinpoint.question}</h3>
              <p className="text-gray-300">{pinpoint.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="font-bold text-xl text-gray-200 mb-6">
            Non-profit product
          </h3>
          <motion.button
            disabled
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] text-gray-900 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Comming soon
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}