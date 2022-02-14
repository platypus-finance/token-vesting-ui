import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NetworkProvider, { useNetworkContext } from "./contexts/NetworkContext";
import TokenVestingApp from "./views/TokenVestingApp";
// const provider = new WalletConnectProvider({
//   rpc: {
//     43113: "https://api.avax-test.network/ext/bc/C/rpc",
//     43114: "https://api.avax.network/ext/bc/C/rpc",
//   },
// });

const App = () => (
  <NetworkProvider>
    <Router>
      <Switch>
        <Route path="/:address/:token?" component={Main} />
        <Route component={MissingAddress} />
      </Switch>
    </Router>
  </NetworkProvider>
);

const Main = function ({ match }) {
  const {
    web3,
    currentProvider,
    setIsFujiRequired,
    web3Modal,
    restoreToDefaultNetworkSettings,
    connectWallet,
  } = useNetworkContext();
  let { address, token } = match.params;

  useEffect(() => {
    // not allow users to close the modal without connecting
    // const ele = document.querySelector(".web3modal-modal-container");
    // ele.style.pointerEvents = "none";
    // if token is obtained, it requires FUJI
    const isFuji = !!token;
    setIsFujiRequired(isFuji);
    if (web3Modal.cachedProvider) {
      connectWallet();
    } else {
      restoreToDefaultNetworkSettings(isFuji);
    }
    // only run on start
    // eslint-disable-next-line
  }, []);
  // TODO validate TokenVesting address
  return currentProvider && web3 && web3.utils.isAddress(address) ? (
    <TokenVestingApp
      address={address}
      // the default PTP token address is from mainnet
      token={token || "0x22d4002028f537599bE9f666d1c4Fa138522f9c8"}
    />
  ) : (
    <MissingAddress />
  );
};

const MissingAddress = () => <p>This is not a TokenVesting address :(</p>;

export default App;
