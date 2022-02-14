class Network {
  constructor(chainId, chainName, rpcUrls, blockExplorerUrls) {
    this.chainId = chainId;
    this.chainName = chainName;
    this.rpcUrls = rpcUrls;
    this.blockExplorerUrls = blockExplorerUrls;
  }
}

export const NETWORKS = {
  FUJI: new Network(
    43113,
    "FUJI C-Chain",
    ["https://api.avax-test.network/ext/bc/C/rpc"],
    ["https://testnet.snowtrace.io/"]
  ),
  AVALANCHE: new Network(
    43114,
    "Avalanche Network",
    ["https://api.avax.network/ext/bc/C/rpc"],
    ["https://snowtrace.io/"]
  ),
};
