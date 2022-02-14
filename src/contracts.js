import contract from "@truffle/contract";

export async function getTokenVesting(address, provider) {
  const TokenVesting = contract(require("./contracts/TokenVesting.json"));
  TokenVesting.setProvider(provider);
  return TokenVesting.at(address);
}

export async function getSimpleToken(address, provider) {
  const SimpleToken = contract(require("./contracts/SimpleToken.json"));
  SimpleToken.setProvider(provider);
  return SimpleToken.at(address);
}
