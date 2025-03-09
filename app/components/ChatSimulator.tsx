'use client'

import { useState, useRef, useEffect } from 'react'
import processCommand from '@/app/utils/db'
type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I\'m ConvictionAI. How can I help you build founder conviction today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add debugging to check component lifecycle
  useEffect(() => {
    console.log('ChatSimulator mounted');
    
    // Return cleanup function to detect unmounting
    return () => {
      console.log('ChatSimulator unmounted');
    };
  }, []);

  // Sample responses for simulation
  const sampleResponses = [
    "That's a great question about founder conviction. The key is to validate your assumptions early and often.",
    "I'd recommend starting with customer interviews to validate your problem hypothesis before building anything.",
    "Market sizing is crucial. Let's break down your TAM, SAM, and SOM to understand the opportunity better.",
    "Have you considered testing this hypothesis with a simple landing page first? It could save you months of development.",
    "Your idea has potential, but I'd suggest narrowing your focus to a more specific customer segment initially."
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return

    // Add user message
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Use processCommand to get real response
      const response = await processCommand(input)
      const aiMessage: Message = { role: 'assistant', content: response }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error processing command:', error)
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=" relative w-full max-w-2xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800 z-50">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100">ConvictionAI Chat</h2>
      </div>
      
      {/* Chat messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-700 text-gray-100 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ConvictionAI something..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
} 