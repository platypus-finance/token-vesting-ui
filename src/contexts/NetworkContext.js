import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
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

// requires sendAsync to solve "Cannot read properties of undefined (reading 'apply')"
Web3.providers.HttpProvider.prototype.sendAsync =
  Web3.providers.HttpProvider.prototype.send;
const defaultProvider = new Web3.providers.HttpProvider();
const defaultWeb3 = new Web3();
function NetworkProvider({ children }) {
  const [currentProvider, setCurrentProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [isFujiRequired, setIsFujiRequired] = useState(false);

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
    } catch (err) {
      console.error(err);
    }
  };

  const switchToAnotherWallet = () => {
    disconnectWallet();
    connectWallet();
  };

  const disconnectWallet = () => {
    restoreToDefaultNetworkSettings(isFujiRequired);
  };

  const restoreToDefaultNetworkSettings = (isFuji) => {
    web3Modal.clearCachedProvider();
    window.localStorage.removeItem("walletconnect");
    defaultProvider.host = isFuji
      ? NETWORKS.FUJI.rpcUrls[0]
      : NETWORKS.AVALANCHE.rpcUrls[0];
    defaultWeb3.setProvider(defaultProvider);
    setWeb3(defaultWeb3);
    setCurrentProvider(defaultProvider);
    setCurrentNetwork(isFuji ? NETWORKS.FUJI : NETWORKS.AVALANCHE);
    setAccount(null);
  };

  useEffect(() => {
    if (
      !currentProvider ||
      !currentProvider.on ||
      !currentProvider.removeListener
    )
      return;
    const updateAccount = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    currentProvider.on("accountsChanged", updateAccount);

    return () => {
      currentProvider.removeListener("accountsChanged", updateAccount);
    };
  }, [currentProvider]);

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
        setIsFujiRequired,
        web3Modal,
        restoreToDefaultNetworkSettings,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export default NetworkProvider;
