"use client";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { defineChain, type Transport } from "viem";
import { createConfig, http } from "wagmi";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error(
    "WalletConnect project ID is not defined. Please check your environment variables.",
  );
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        ledgerWallet,
        rabbyWallet,
        coinbaseWallet,
        argentWallet,
        safeWallet,
      ],
    },
  ],
  { appName: "caddieGPT", projectId: walletConnectProjectId },
);

// Fix missing icons
// const customZkSyncSepoliaTestnet = { ...zkSyncSepoliaTestnet, iconUrl: zksync_logo.src };
// const customLinea = { ...linea, iconUrl: linea_logo.src };
// const customLineaTestnet = { ...lineaTestnet, iconUrl: lineaTesnet_logo.src };

export const galadriel_devnet = /*#__PURE__*/ defineChain({
  id: 69_6969,
  name: 'Galadriel Devnet',
  nativeCurrency: { name: 'Galadriel', symbol: 'GAL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://devnet.galadriel.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Galadriel Devnet Scan',
      url: 'https://explorer.galadriel.com',
      apiUrl: 'https://explorer.galadriel.com/api/v2',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
})

const transports: Record<number, Transport> = {
  [galadriel_devnet.id]: http(),
};
export const wagmiConfig = createConfig({
  chains: [
    galadriel_devnet,
  ],
  connectors,
  transports,
  ssr: true,
});
