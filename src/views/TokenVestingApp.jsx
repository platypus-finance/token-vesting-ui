import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import { getTokenVesting, getSimpleToken } from "../contracts";

import Header from "./Header";
import VestingDetails from "./VestingDetails";
import VestingSchedule from "./VestingSchedule";
import Spinner from "./Spinner";

import "../stylesheets/TokenVestingApp.css";
import { NetworkContext } from "../contexts/NetworkContext";

class TokenVestingApp extends Component {
  constructor() {
    super();
    this.state = { name: "Token", loading: true };
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { address, token } = this.props;
    const { account, switchToAnotherWallet, connectWallet, disconnectWallet } =
      this.context;

    return (
      <div className="TokenVestingApp">
        {this.state.loading ? <Spinner /> : null}

        <Header address={address} token={token} tokenName={this.state.name} />

        <Grid>
          <Row>
            <Col style={{ textAlign: "left" }}>
              {account ? (
                <>
                  <h4>My Address: {account}</h4>
                  <button
                    className="wallet-button"
                    onClick={switchToAnotherWallet}
                  >
                    Switch Wallet
                  </button>
                  <button className="wallet-button" onClick={disconnectWallet}>
                    Disconnect
                  </button>
                </>
              ) : (
                <button className="wallet-button" onClick={connectWallet}>
                  Connect Your Wallet
                </button>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <VestingDetails
                address={address}
                token={token}
                details={this.state}
                getData={() => this.getData()}
                setLoader={(x) => this.setLoader(x)}
              />
            </Col>

            <Col xs={12} md={6}>
              <VestingSchedule details={this.state} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  setLoader(loading) {
    this.setState({ loading });
  }

  async getData() {
    const { currentProvider } = this.context;
    const { address, token } = this.props;
    try {
      const tokenVesting = await getTokenVesting(address, currentProvider);
      const tokenContract = await getSimpleToken(token, currentProvider);

      const start = await tokenVesting.start();
      const duration = await tokenVesting.duration();
      const end = start.add(duration);
      const balance = await tokenContract.balanceOf(address);
      const released = await tokenVesting.released(token);
      const total = balance.add(released);

      this.setState({
        start,
        end,
        cliff: await tokenVesting.cliff(),
        total,
        released,
        vested: await tokenVesting.vestedAmount(token),
        decimals: await tokenContract.decimals(),
        beneficiary: await tokenVesting.beneficiary(),
        owner: await tokenVesting.owner(),
        revocable: await tokenVesting.revocable(),
        revoked: await tokenVesting.revoked(token),
        name: await tokenContract.name(),
        symbol: await tokenContract.symbol(),
        loading: false,
      });
    } catch (err) {
      // if the message is "Cannot create instance of TokenVesting; no code at address",
      // it means it is in the wrong network.
      console.error(err);
    }
  }
}

TokenVestingApp.contextType = NetworkContext;
export default TokenVestingApp;
