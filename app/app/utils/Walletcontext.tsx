import React, { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  NightlyWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import default styles from @solana/wallet-adapter-react-ui
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletConnectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Use a specific Solana cluster (mainnet-beta, testnet, devnet)
  const network = "https://api.testnet.sonic.game";

  // Set up wallet adapters
  const wallets = useMemo(
    () => [
      new NightlyWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
