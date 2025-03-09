import React, { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-solana'
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
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
      new UnsafeBurnerWalletAdapter(), NightlyConnectAdapter.buildLazy(
        {
          appMetadata: {
            name: 'SolanaAdapter',
            description: 'Solana Adapter Test',
            icon: 'https://docs.nightly.app/img/logo.png',
            additionalInfo: 'Courtesy of Nightly Connect team'
          }
          //   persistent: false  -  Add this if you want to make the session non-persistent
        }
        // { initOnConnect: true, disableModal: true, disableEagerConnect: true }  -  You may specify the connection options object here
        // document.getElementById("modalAnchor")  -  You can pass an optional anchor element for the modal here
      )
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
