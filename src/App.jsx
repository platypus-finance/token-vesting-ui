import React from "react";
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
  const { account, web3 } = useNetworkContext();
  let { address, token } = match.params;
  // TODO validate TokenVesting address
  return account && web3.utils.isAddress(address) ? (
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
