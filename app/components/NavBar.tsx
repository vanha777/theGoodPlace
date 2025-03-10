'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
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
            {/* Background with light theme matching Landing */}
            <div className="absolute inset-0 bg-[#f5f9fa] shadow-md">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ffe1]/10 via-[#00d9ff]/10 to-[#00a3ff]/10" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {/* <div className="w-10 h-10 rounded-md bg-gradient-to-r from-[#00ffe1] via-[#00d9ff] to-[#00a3ff] flex items-center justify-center shadow-[0_0_10px_rgba(0,217,255,0.5)] hover:scale-105 transition-transform p-1.5"> */}
                        <Image
                            src="/apple.png"
                            alt="The Good Place Logo"
                            width={58}
                            height={58}
                            className="object-contain"
                        />
                        {/* </div> */}
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <span className="text-xl font-serif italic text-gray-700 font-medium">
                            Your lovely ones will be remembered
                        </span>
                    </div>

                    {/* CTA Button */}
                    <div>
                        {wallet ? (
                            <WalletMultiButtonDynamic
                                style={{
                                    // background: "linear-gradient(to right, #00ffe1, #00d9ff, #00a3ff)",
                                    background: "transparent",
                                    color: "#000000",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 0 15px rgba(0, 217, 255, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backdropFilter: "blur(4px)"
                                }}
                            />
                        ) : (
                            <WalletMultiButtonDynamic
                                style={{
                                    // background: "linear-gradient(to right, #00ffe1, #00d9ff, #00a3ff)",
                                    background: "transparent",
                                    color: "#000000",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 4px 6px rgba(0, 217, 255, 0.2)",
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