'use client'

import { useState, useRef, useEffect } from 'react'
import processCommand, { checkIfPdaExists, PersonalityTemplate, processCreate, uploadPersonalityToSupabase } from '@/app/utils/db'
import idl from "../models/the_good_place.json";
import { useWallet, useConnection, Wallet } from "@solana/wallet-adapter-react"
import { PublicKey, Keypair, SystemProgram, Transaction, VersionedTransaction } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { sha256 } from 'js-sha256';
import { createHash } from 'crypto';
import UpdateOverlay from '../update';
import { useAppContext } from '@/app/utils/AppContext';
type Message = {
  role: 'user' | 'assistant'
  content: string
}
interface ChatSimulatorV2Props {
  action: string;
  createUpdateView: () => void;
  resetView: () => void;
  talkingView: () => void;
}

export default function ChatSimulatorV2({
  action,
  createUpdateView,
  resetView,
  talkingView
}: ChatSimulatorV2Props) {
  const { userData } = useAppContext();
  const [personData, setPersonData] = useState<PersonalityTemplate | null>(null)
  const { publicKey, connected, connect, disconnect, signMessage, wallet, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [overlay, setOverlay] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add debugging to check component lifecycle
  useEffect(() => {
    if (connected) {
      talkingView();
    }
    console.log('ChatSimulator mounted');

    // Return cleanup function to detect unmounting
    return () => {
      console.log('ChatSimulator unmounted');
    };
  }, [connected]);

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return

    // Add user message
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    talkingView();

    try {
      // Get the current template from state or initialize a new one if it doesn't exist
      const currentTemplate = personData || createEmptyTemplate();

      // Use processCreate to get response and updated template
      const result = await processCreate(currentTemplate, input);
      console.log("result return to Simulator", result.template);
      // Save the updated template to state
      setPersonData(result.template);

      // Add AI response to messages
      const aiMessage: Message = { role: 'assistant', content: result.message }
      setMessages(prev => [...prev, aiMessage])

      // If the creation process is complete, you might want to do something with the template
      if (result.action === "completed" && result.uri) {
        console.log("Create person on-chain", result.template);
        const password = publicKey?.toBase58() || "";
        const seed = Uint8Array.from(
          createHash("sha256").update(password).digest()
        ); // 32 bytes guaranteed
        const entrySeed = Keypair.fromSeed(seed);
        const pdaExists = await checkIfPdaExists(connection, entrySeed.publicKey);
        if (pdaExists) {
          updatePerson(result.uri);
        } else {
          createPerson(result.uri);
        }
      }
    }
    catch (error) {
      console.error('Error processing create command:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // resetView();
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return
    if (userData.personality === null) {
      alert("Please create a person first")
      return
    }
    if (action === "create") {
      handleCreatePerson(e);
    } else {
      // Add user message
      const userMessage: Message = { role: 'user', content: input }
      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsLoading(true)
      talkingView();

      try {
        // Use processCommand to get real response
        const response = await processCommand(input, userData.personality)
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
        // resetView();
      }
    }

  }

  const handleManuallyUpdate = async (updatedTemplate: PersonalityTemplate) => {
    console.log("handleUpdate", updatedTemplate);
    setPersonData(updatedTemplate);
    setIsLoading(true);
    talkingView();
    // Upload the updated template to Supabase
    try {
      const uuid = crypto.randomUUID();
      const { url } = await uploadPersonalityToSupabase(updatedTemplate, uuid);
      console.log("Successfully uploaded updated personality to Supabase");
      if (url) {
        console.log("Creating person on-chain");
        try {
          createPerson(url);
        } catch (error) {
          console.error("Error creating person on-chain:", error);
        }
      }
    } catch (error) {
      console.error("Error uploading personality to Supabase:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Successfully uploaded updated personality" }]);
    }
    // setOverlay(false);
  };

  // on-chain operations
  const createPerson = async (uri: string) => {
    console.log("create person 0");
    if (publicKey) {
      const personName = personData?.personalInfo.name.firstName;
      const password = publicKey?.toBase58();
      const personUri = uri;
      const programID = new PublicKey(idl.address);
      // Generate a deterministic keypair from a seed
      const seed = Uint8Array.from(
        createHash("sha256").update(password).digest()
      ); // 32 bytes guaranteed
      const entrySeed = Keypair.fromSeed(seed);
      // Generate a random Keypair for entrySeed
      // const entrySeed = Keypair.generate();
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
    }

  };

  const updatePerson = async (uri: string) => {
    if (publicKey) {
      console.log("update person 0");
      const password = publicKey.toBase58();
      const personName = personData?.personalInfo.name.firstName;
      const personUri = uri;
      // const programID = new PublicKey(idl.address);
      const seed = Uint8Array.from(
        createHash("sha256").update(password).digest()
      ); // 32 bytes guaranteed
      const entrySeed = Keypair.fromSeed(seed);
      // Generate a random Keypair for entrySeed
      // const entrySeed = Keypair.generate();

      console.log("update person 1");
      if (!connected || !publicKey || !wallet) {
        alert("Please connect your wallet first");
        return;
      }
      console.log("update person 2");

      try {
        console.log("update person 3");

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
        console.log("update person 4");

        const program = new Program(idl as any, provider); // Use 'any' temporarily if IDL type issues persist

        // Pass authority as a PublicKey, not a string, if required by the program
        const authority = walletPublicKey;

        const tx = await program.methods
          .updatePerson(personName, personUri)
          .accounts({
            entrySeed: entrySeed.publicKey,
          })
          // .signers([entrySeed])
          .rpc();

        console.log("update person 5");
        console.log("Transaction signature:", tx);
        alert("Person updated successfully!");
      } catch (error) {
        console.error("Error updating person:", error);
        alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  // Helper function to create an empty personality template
  const createEmptyTemplate = (): PersonalityTemplate => {
    return {
      personalInfo: {
        name: {
          firstName: null,
          lastName: null,
          preferredName: null,
        },
        dateOfBirth: null,
        dateOfPassing: null,
        gender: null,
        contact: {
          email: null,
          phone: null,
        },
        residence: {
          street: null,
          city: null,
          state: null,
          country: null,
          postalCode: null,
        },
      },
      traits: {
        personality: {
          mbti: null,
          strengths: [],
          challenges: [],
        },
        interests: [],
        values: [],
        mannerisms: [],
      },
      favorites: {
        colors: [],
        foods: [],
        movies: [],
        books: [],
        music: {
          genres: [],
          artists: [],
        },
      },
      // education: {
      //   degree: null,
      //   university: null,
      //   graduationYear: null,
      // },
      // career: {
      //   currentPosition: null,
      //   company: null,
      //   yearsOfExperience: null,
      //   skills: [],
      // },
      languages: {
        language: [
          {
            name: null,
            proficiency: null,
          },
        ],
      },
      memories: {
        significantEvents: [],
        sharedExperiences: [],
        familyMembers: [],
        personalStories: [],
      },
      relationships: {
        family: [
          {
            name: null,
            relation: null,
            details: null,
          },
        ],
        friends: [
          {
            name: null,
            details: null,
          },
        ],
      },
    };
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden z-50">
      {personData && overlay && action === "create" && (
        <UpdateOverlay
          template={personData}
          onClose={() => setOverlay(false)}
          onSubmit={handleManuallyUpdate}
        />
      )}
      {/* <div className="flex space-x-2 p-2"> */}
        {/* <button
          onClick={createPerson}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Create Person
        </button>
        <button
          onClick={updatePerson}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Update Person
        </button> */}
        {personData && action === "create" && (
          <button
            onClick={() => setOverlay(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Person
          </button>
        )}
      {/* </div> */}

      {/* Chat messages - limited to last 3-4 messages */}
      <div className="max-h-32 overflow-y-auto p-2 space-y-2">
        {messages.slice(-4).map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-2 rounded-lg text-sm ${message.role === 'user'
                ? 'bg-blue-600 bg-opacity-80 text-white rounded-br-none'
                : 'bg-gray-700 bg-opacity-80 text-gray-100 rounded-bl-none'
                }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 bg-opacity-80 text-gray-100 p-2 rounded-lg rounded-bl-none">
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
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-700 bg-gray-800 bg-opacity-60">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask TheGoodPlacce something..."
            className="flex-1 bg-gray-700 bg-opacity-70 text-gray-100 rounded-l-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
} 