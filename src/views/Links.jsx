import React from "react";
import { useNetworkContext } from "../contexts/NetworkContext";

function ContractLink({ address }) {
  const { currentNetwork } = useNetworkContext();
  const href = `${currentNetwork?.blockExplorerUrls[0]}address/${address}`;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {address}
    </a>
  );
}

function TokenLink({ address, name }) {
  const { currentNetwork } = useNetworkContext();
  const href = `${currentNetwork?.blockExplorerUrls[0]}token/${address}`;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {name}
    </a>
  );
}

export { ContractLink, TokenLink };
