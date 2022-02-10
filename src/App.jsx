import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Web3 from "web3";

import TokenVestingApp from "./views/TokenVestingApp";

const App = () => (
  <Router>
    <Switch>
      <Route path="/:address/:token?" component={Main} />
      <Route component={MissingAddress} />
    </Switch>
  </Router>
);

const Main = function ({ match }) {
  let web3 = new Web3();
  let { address, token } = match.params;
  // TODO validate TokenVesting address
  return web3.utils.isAddress(address) ? (
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
