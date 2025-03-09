'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import dynamic from 'next/dynamic'

// Dynamically import the WalletMultiButton to avoid SSR issues
const WalletMultiButtonDynamic = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false }
  )
  

export default function NavBar() {
    const { publicKey, connected, connect, disconnect, signMessage, wallet } = useWallet();
    const { connection } = useConnection();

    useEffect(() => {
        console.log("this is wallet", wallet?.readyState)
        console.log("this is publicKey", publicKey?.toString())
        console.log("this is connected", connected)
        console.log("this is connection", connection.rpcEndpoint)
    }, [publicKey]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="top-0 w-full z-50"
        >
            {/* Background with dark theme */}
            <div className="absolute inset-0 bg-transparent">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-black" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold tracking-tight text-[#E0FF00] drop-shadow-sm hover:scale-105 transition-transform flex items-center">
                            <div className="mr-2 w-8 h-8 rounded-md bg-[#E0FF00] flex items-center justify-center text-gray-900 text-xs">
                                AI
                            </div>
                            TheGood<span className="text-3xl">Place</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <span className="text-xl font-serif italic text-[#E0FF00] font-medium">
                            Don't skip the "V" in "MVP"
                        </span>
                        {/* <Link href="#features" className="text-gray-300 hover:text-[#E0FF00] transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-gray-300 hover:text-[#E0FF00] transition-colors">
                            How It Works
                        </Link>
                        <Link href="#pricing" className="text-gray-300 hover:text-[#E0FF00] transition-colors">
                            Pricing
                        </Link> */}
                    </div>

                    {/* CTA Button */}
                    <div>
                        {wallet ? (
                            <WalletMultiButtonDynamic
                                style={{
                                    background: "#E0FF00",
                                    color: "#000000",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(224, 255, 0, 0.2)",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 0 15px rgba(224, 255, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backdropFilter: "blur(4px)"
                                }}
                            />
                        ) : (
                            <WalletMultiButtonDynamic
                                style={{
                                    backgroundColor: "#E0FF00",
                                    color: "#000000",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(224, 255, 0, 0.2)",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 4px 6px rgba(224, 255, 0, 0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}