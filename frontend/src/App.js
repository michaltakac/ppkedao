// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";

async function sendTx() {
  const mnemonic = "tray kitchen romance hunt crime daughter museum scout inform network talent circle spy flash unhappy wagon melt forum stone best simple novel party panda";
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const [firstAccount] = await wallet.getAccounts();

  const rpcEndpoint = "http://0.0.0.0:26657";
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);
  console.log(client);
  const recipient = "cosmos1kw7cv95djqg7vd9en8mxsvuha8txvadjv4zcpr";
  const amount = {
  denom: "stake",
  amount: "10000",
  };

  // const result = await client.sendTokens(firstAccount.address, recipient, [amount], "Have fun with your star coins");
  // assertIsBroadcastTxSuccess(result);
}

function App() {
  return (
    <div className="App">
      <button onClick={sendTx} className='btSend'>Send tx Tomas ={'>'} Marek</button>
    </div>
  );
}

export default App;