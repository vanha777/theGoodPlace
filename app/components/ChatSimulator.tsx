'use client'

import { useState, useRef, useEffect } from 'react'
import processCommand from '@/app/utils/db'
import idl from "../../target/idl/the_good_place.json";
import { useWallet, useConnection, Wallet } from "@solana/wallet-adapter-react"
import { PublicKey, Keypair, SystemProgram, Transaction, VersionedTransaction } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { sha256 } from 'js-sha256';
type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatSimulator() {
  const { publicKey, connected, connect, disconnect, signMessage, wallet, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [messages, setMessages] = useState<Message[]>([])
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
  // const sampleResponses = [
  //   "That's a great question about founder conviction. The key is to validate your assumptions early and often.",
  //   "I'd recommend starting with customer interviews to validate your problem hypothesis before building anything.",
  //   "Market sizing is crucial. Let's break down your TAM, SAM, and SOM to understand the opportunity better.",
  //   "Have you considered testing this hypothesis with a simple landing page first? It could save you months of development.",
  //   "Your idea has potential, but I'd suggest narrowing your focus to a more specific customer segment initially."
  // ]

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

  const createPerson = async () => {
    console.log("create person 0");
  
    const personName = "John Doe";
    const personUri = "https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general/boHoang.json";
    const programID = new PublicKey(idl.address);
  
    // Generate a random Keypair for entrySeed
    const entrySeed = Keypair.generate();
  
    console.log("create person 1");
    if (!connected || !publicKey || !wallet) {
      alert("Please connect your wallet first");
      return;
    }
    console.log("create person 2");
  
    try {
      console.log("create person 3");
  
      // Ensure publicKey is a PublicKey instance
      const walletPublicKey = new PublicKey(publicKey); // Convert if necessary
  
      // Create a wallet object compatible with AnchorProvider
      const customWallet = {
        publicKey: walletPublicKey,
        signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
          if (!signTransaction) throw new Error("Wallet not connected");
          return signTransaction(tx) as Promise<T>;
        },
        signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
          if (!signAllTransactions) throw new Error("Wallet not connected");
          return signAllTransactions(txs) as Promise<T[]>;
        },
      };
  
      const provider = new AnchorProvider(
        connection,
        customWallet,
        { preflightCommitment: "processed" }
      );
      console.log("create person 4");
  
      const program = new Program(idl as any, provider); // Use 'any' temporarily if IDL type issues persist
  
      // Pass authority as a PublicKey, not a string, if required by the program
      const authority = walletPublicKey;
  
      const tx = await program.methods
        .createPerson(personName, personUri, authority)
        .accounts({
          entrySeed: entrySeed.publicKey,
          systemProgram: SystemProgram.programId,
        })
        // .signers([entrySeed])
        .rpc();
  
      console.log("create person 5");
      console.log("Transaction signature:", tx);
      alert("Person created successfully!");
    } catch (error) {
      console.error("Error creating person:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className=" relative w-full max-w-2xl mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800 z-50">

      <button
        onClick={createPerson}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Create Person
      </button>
      <button
        // onClick={createPerson}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Update Person
      </button>

      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100">TheGoodPlacce Chat</h2>
      </div>

      {/* Chat messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${message.role === 'user'
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
            placeholder="Ask TheGoodPlacce something..."
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