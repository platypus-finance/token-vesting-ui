import React, { useEffect, useState } from "react";
import Network from "../network";

function useExplorerUrl() {
  const [explorerUrl, setExplorerUrl] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const explorerUrl = await Network.getExplorerUrl();
      const chainId = explorerUrl.chainId;
      switch (chainId) {
        case "0xa86a":
          // AVALANCHE
          setExplorerUrl("https://snowtrace.io/");
          break;
        case "0xa869":
          // FUJI
          setExplorerUrl("https://testnet.snowtrace.io/");
          break;
        default:
      }
    };
    fetchData();
  }, []);

  return { explorerUrl };
}

function ContractLink({ address }) {
  const { explorerUrl } = useExplorerUrl();
  const href = `${explorerUrl}address/${address}`;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {address}
    </a>
  );
}

function TokenLink({ address, name }) {
  const { explorerUrl } = useExplorerUrl();
  const href = `${explorerUrl}/token/${address}`;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {name}
    </a>
  );
}

export { ContractLink, TokenLink };
