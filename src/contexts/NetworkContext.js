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

function NetworkProvider({ children }) {
  const [currentProvider, setCurrentProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  const connectToWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        providerOptions, // required
      });
      const provider = await web3Modal.connect();
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      // console.log(accounts);
      const web3Instance = new Web3(provider);
      const account = await web3Instance.eth.getAccounts();

      setWeb3(web3Instance);
      setCurrentProvider(provider);
      setAccount(account[0]);

      let chainId = provider.chainId;
      if (chainId.startsWith("0x")) {
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
      console.log(e);
    }
  };
  useEffect(() => {
    connectToWallet();
  }, []);
  return (
    <NetworkContext.Provider
      value={{ web3, currentProvider, account, currentNetwork }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export default NetworkProvider;
