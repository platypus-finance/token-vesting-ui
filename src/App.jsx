import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NetworkProvider, { useNetworkContext } from "./contexts/NetworkContext";
import TokenVestingApp from "./views/TokenVestingApp";

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
  const { web3, currentProvider, web3Modal, connectWallet } =
    useNetworkContext();
  let { address, token } = match.params;
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
    // only run on start
    // eslint-disable-next-line
  }, []);

  return currentProvider && web3 && web3.utils.isAddress(address) ? (
    <TokenVestingApp
      currentProvider={currentProvider}
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
