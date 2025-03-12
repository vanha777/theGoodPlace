'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { checkIfPdaExists, fetchPersonality, PersonalityTemplate } from "@/app/utils/db";
import { useWallet, useConnection, Wallet } from "@solana/wallet-adapter-react"
import { Keypair, PublicKey } from '@solana/web3.js';
import { createHash } from 'crypto';
export interface UserData {
    personality: PersonalityTemplate | null;
}

export interface AppContextData {
    userData: UserData;
    setUserData: (userData: UserData) => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const { publicKey, connected, connect, disconnect, signMessage, wallet } = useWallet();
    const { connection } = useConnection();
    // Listen for wallet changes and derive PDA when connected
    useEffect(() => {
        console.log("refetching personality");
        if (connected && publicKey) {
            console.log('Wallet connected:', publicKey.toBase58())
            // Example: Derive a PDA when wallet connects
            const derivePda = async () => {
                const programId = new PublicKey(process.env.NEXT_PUBLIC_THE_GOOD_PLACE_PROGRAM_ID || "")
                const password = publicKey?.toBase58() || "";
                const seed = Uint8Array.from(
                    createHash("sha256").update(password).digest()
                ); // 32 bytes guaranteed
                const entrySeed = Keypair.fromSeed(seed);
                const pdaExists = await checkIfPdaExists(connection, entrySeed.publicKey);
                if (pdaExists) {
                    console.log("personality exists")
                    const personality = await fetchPersonality(entrySeed.publicKey.toBase58());
                    setUserData({ personality: personality })
                } else {
                    console.log("personality does not exist")
                    setUserData({ personality: null })
                }
            }
            derivePda()
        } else {
            console.log('Wallet disconnected')
            setUserData({ personality: null })
        }
    }, [connected, publicKey])
    const [userData, setUserData] = useState<UserData>({
        personality: null,
    });

    const value: AppContextData = {
        userData,
        setUserData
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
