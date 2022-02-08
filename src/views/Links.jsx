import React from "react";

function ContractLink({ address }) {
  const href = `https://snowtrace.io/address/${address}`;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {address}
    </a>
  );
}

function TokenLink({ address, name }) {
  const href = `https://snowtrace.io/token/${address}`;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {name}
    </a>
  );
}

export { ContractLink, TokenLink };
