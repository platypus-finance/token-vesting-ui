import React, { createContext, useContext, useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";

import Web3Modal from "web3modal";
import Web3 from "web3";
import { NETWORKS } from "../configs/networks";
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        [NETWORKS.FUJI.chainId]: NETWORKS.FUJI.rpcUrls[0],
        [NETWORKS.AVALANCHE.chainId]: NETWORKS.AVALANCHE.rpcUrls[0],
      },
    },
  },
};

export const NetworkContext = createContext();

export const useNetworkContext = () => {
  return useContext(NetworkContext);
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions, // required
});

/** @todo remove hardcoded fuji */
const defaultProvider = new Web3.providers.HttpProvider(
  NETWORKS.FUJI.rpcUrls[0]
);
const defaultWeb3 = new Web3(defaultProvider);

function NetworkProvider({ children }) {
  const [currentProvider, setCurrentProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const web3Instance = new Web3(provider);
      const account = await web3Instance.eth.getAccounts();
      setWeb3(web3Instance);
      setCurrentProvider(provider);
      setAccount(account[0]);

      // set nework
      let chainId = provider.chainId;
      if (typeof chainId !== "number" && chainId.startsWith("0x")) {
        chainId = parseInt(chainId, 16);
      }

      switch (chainId) {
        case NETWORKS.AVALANCHE.chainId:
          // AVALANCHE
          setCurrentNetwork(NETWORKS.AVALANCHE);
          break;
        case NETWORKS.FUJI.chainId:
          // FUJI
          setCurrentNetwork(NETWORKS.FUJI);
          break;
        default:
          setCurrentNetwork(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const switchToAnotherWallet = () => {
    disconnectWallet();
    connectWallet();
  };

  const disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    restoreToDefaultNetworkSettings();
    window.localStorage.removeItem("walletconnect");
  };

  const restoreToDefaultNetworkSettings = () => {
    setWeb3(defaultWeb3);
    setCurrentProvider(defaultWeb3.givenProvider);
    setCurrentNetwork(NETWORKS.FUJI);
    setAccount(null);
  };
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    } else {
      restoreToDefaultNetworkSettings();
    }
  }, []);
  return (
    <NetworkContext.Provider
      value={{
        web3,
        currentProvider,
        account,
        currentNetwork,
        switchToAnotherWallet,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export default NetworkProvider;
