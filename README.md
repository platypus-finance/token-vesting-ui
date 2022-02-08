# Token Vesting Dapp

Web-based GUI to interact with the [Token Vesting contract](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/TokenVesting.sol) provided by the [OpenZeppelin](https://openzeppelin.org) [library](https://github.com/OpenZeppelin/zeppelin-solidity).

![Token Vesting Dapp](https://github.com/OpenZeppelin/token-vesting-ui/blob/master/example.png)

## Usage

### 1. Install the dependencies

```
yarn install
```

Also make sure you have [Metamask](https://metamask.io/) installed, pointing to the right network and your account is unlocked.

### 2. Start the web server

```
yarn start
```

### 3. Ready!

Go to `http://localhost:3000/<token-vesting-address>/<erc20-token-address>` and interact with the contract!
