import moment from "moment";
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { NetworkContext } from "../contexts/NetworkContext";
import { getTokenVesting } from "../contracts";
import { displayAmount } from "../utils";
import Emoji from "./Emoji";
import { ContractLink } from "./Links";

class VestingDetails extends Component {
  constructor() {
    super();
    this.state = { canRevoke: false };
  }

  async componentWillReceiveProps(nextProps) {
    const { owner, revoked } = nextProps.details;
    const { account } = this.context;
    const isOwner = account ? owner === account.toLowerCase() : undefined;

    this.setState({ canRevoke: isOwner && !revoked });
  }

  render() {
    const {
      start,
      cliff,
      end,
      total,
      released,
      vested,
      revocable,
      beneficiary,
    } = this.props.details;
    const releasable = vested ? vested - released : null;

    return (
      <div className="details">
        <h4>Vesting details</h4>
        <Table striped bordered condensed>
          <tbody>
            <TableRow title="Beneficiary">
              <ContractLink address={beneficiary} />
            </TableRow>

            <TableRow title="Start date">{this.formatDate(start)}</TableRow>

            <TableRow title="Cliff">{this.formatDate(cliff)}</TableRow>

            <TableRow title="End date">{this.formatDate(end)}</TableRow>

            <TableRow title="Total vesting">
              {this.formatTokens(total)}
            </TableRow>

            <TableRow title="Already vested">
              {this.formatTokens(vested)}
            </TableRow>

            <TableRow title="Already released">
              {this.formatTokens(released)}
            </TableRow>

            <TableRow title="Releasable">
              <Releasable
                releasable={releasable}
                onRelease={() => this.onRelease()}
              >
                {this.formatTokens(releasable)}
              </Releasable>
            </TableRow>

            <TableRow title="Revocable">
              <Revocable
                revocable={revocable}
                canRevoke={this.state.canRevoke}
                onRevoke={() => this.onRevoke()}
              />
            </TableRow>
          </tbody>
        </Table>
      </div>
    );
  }

  formatDate(date) {
    if (!date) return;
    const milliseconds = date * 1000;
    return moment(milliseconds).format("dddd, MMMM Do YYYY, h:mm:ss a");
  }

  formatTokens(amount) {
    if (amount == null) return;
    const { decimals, symbol } = this.props.details;
    const display = displayAmount(amount, decimals);

    return `${display} ${symbol}`;
  }

  startLoader() {
    this.props.setLoader(true);
  }

  stopLoader() {
    this.props.setLoader(false);
  }

  async getTokenVesting() {
    const { currentProvider } = this.context;
    return getTokenVesting(this.props.address, currentProvider);
  }

  async onRelease() {
    const { token } = this.props;
    const { account } = this.context;
    try {
      const tokenVesting = await this.getTokenVesting();
      this.startLoader();
      await tokenVesting.release(token, { from: account });
      this.props.getData();
    } catch (e) {
      this.stopLoader();
    }
  }

  async onRevoke() {
    const { token } = this.props;
    const { account } = this.context;
    try {
      const tokenVesting = await this.getTokenVesting();
      this.startLoader();
      await tokenVesting.revoke(token, { from: account });
      this.props.getData();
    } catch (e) {
      this.stopLoader();
    }
  }
}

function TableRow({ title, children }) {
  return (
    <tr>
      <th>{title}</th>
      <td>{children}</td>
    </tr>
  );
}

function Revocable({ revocable, onRevoke, canRevoke }) {
  if (!revocable) return <Emoji e="❌" />;

  return (
    <span>
      <Emoji e="✅" />
      {canRevoke ? (
        <button className="action" onClick={onRevoke}>
          revoke
        </button>
      ) : null}
    </span>
  );
}

function Releasable({ releasable, onRelease, children }) {
  return (
    <span>
      {children}
      {releasable > 0 ? (
        <button className="action" onClick={onRelease}>
          release
        </button>
      ) : null}
    </span>
  );
}

VestingDetails.contextType = NetworkContext;

export default VestingDetails;
