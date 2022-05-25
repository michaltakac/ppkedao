import logo from "./logo.svg";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
  StargateClient,
} from "@cosmjs/stargate";
import "./App.css";

async function initCosmos() {
  // const mnemonic = "zoo public spy orbit rookie into arrive pulse they flush genre lawsuit suffer thunder piano zebra scene plate desert globe laugh vibrant lake response"

  // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  // const [firstAccount] = await wallet.getAccounts();
  // console.log(firstAccount)

  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install keplr extension");
  } else {
    if (window.keplr.experimentalSuggestChain) {
      try {
          // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
          // cosmoshub-3 is integrated to Keplr so the code should return without errors.
          // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
          // If the user approves, the chain will be added to the user's Keplr extension.
          // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
          // If the same chain id is already registered, it will resolve and not require the user interactions.
          await window.keplr.experimentalSuggestChain({
              // Chain-id of the Cosmos chain.
              chainId: "ppkedao",
              // The name of the chain to be displayed to the user.
              chainName: "PPKE DAO Testnet",
              // RPC endpoint of the chain. In this case we are using blockapsis, as it's accepts connections from any host currently. No Cors limitations.
              rpc: "http://0.0.0.0:26657",
              // REST endpoint of the chain.
              rest: "http://0.0.0.0:1317",
              // Staking coin information
              stakeCurrency: {
                  // Coin denomination to be displayed to the user.
                  coinDenom: "PPKE",
                  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                  coinMinimalDenom: "stake",
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 6,
                  // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                  // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                  // coinGeckoId: ""
              },
              // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
              // The 'stake' button in Keplr extension will link to the webpage.
              // walletUrlForStaking: "",
              // The BIP44 path.
              bip44: {
                  // You can only set the coin type of BIP44.
                  // 'Purpose' is fixed to 44.
                  coinType: 118,
              },
              bech32Config: {
                  bech32PrefixAccAddr: "cosmos",
                  bech32PrefixAccPub: "cosmospub",
                  bech32PrefixValAddr: "cosmosvaloper",
                  bech32PrefixValPub: "cosmosvaloperpub",
                  bech32PrefixConsAddr: "cosmosvalcons",
                  bech32PrefixConsPub: "cosmosvalconspub"
              },
              // List of all coin/tokens used in this chain.
              currencies: [{
                  // Coin denomination to be displayed to the user.
                  coinDenom: "PPKE",
                  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                  coinMinimalDenom: "token",
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 6,
                  // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                  // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                  // coinGeckoId: ""
              }],
              // List of coin/tokens used as a fee token in this chain.
              feeCurrencies: [{
                  // Coin denomination to be displayed to the user.
                  coinDenom: "PPKE",
                  // Actual denom (i.e. uosmo, uscrt) used by the blockchain.
                  coinMinimalDenom: "token",
                  // # of decimal points to convert minimal denomination to user-facing denomination.
                  coinDecimals: 6,
                  // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                  // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                  // coinGeckoId: ""
              }],
              // (Optional) The number of the coin type.
              // This field is only used to fetch the address from ENS.
              // Ideally, it is recommended to be the same with BIP44 path's coin type.
              // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
              // So, this is separated to support such chains.
              coinType: 118,
              // (Optional) This is used to set the fee of the transaction.
              // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
              // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
              // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
              gasPriceStep: {
                  low: 0.01,
                  average: 0.025,
                  high: 0.04
              }
          });
      } catch {
          alert("Failed to suggest the chain");
      }
  } else {
      alert("Please use the recent version of keplr extension");
  }
}

    const rpcEndpoint = "http://0.0.0.0:26657";

    const chainId = "ppkedao";

    // You should request Keplr to enable the wallet.
    // This method will ask the user whether or not to allow access if they haven't visited this website.
    // Also, it will request user to unlock the wallet if the wallet is locked.
    // If you don't request enabling before usage, there is no guarantee that other methods will work.
    await window.keplr.enable(chainId);

    const offlineSigner = window.getOfflineSigner(chainId);
    console.log(offlineSigner)

    // You can get the address/public keys by `getAccounts` method.
    // It can return the array of address/public key.
    // But, currently, Keplr extension manages only one address/public key pair.
    // XXX: This line is needed to set the sender address for SigningCosmosClient.
    const accounts = await offlineSigner.getAccounts();
    console.log(accounts)

    // Initialize the gaia api with the offline signer that is injected by Keplr extension.
    // const cosmJS = new SigningCosmosClient(
    //     rpcEndpoint,
    //     accounts[0].address,
    //     offlineSigner,
    // );
    // console.log(client);

    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      offlineSigner
    );
    console.log(client);
    console.log(await client.queryClient.bank.totalSupply())
    console.log(await client.queryClient.bank.balance(accounts[0].address, "token"))
}

function App() {
  initCosmos();

  async function sendTx() {
    const amount = parseFloat(100);
    const recipient = "cosmos1g3hezh7xla3hn7mc0r6z0vs2z6van2qcm88vsh"

    const chainId = "ppkedao";
    const rpcEndpoint = "http://0.0.0.0:26657";
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        console.log(accounts)

        const client = await SigningStargateClient.connectWithSigner(
          rpcEndpoint,
            offlineSigner
        )
        console.log("new client", client)

        const amountFinal = {
            denom: 'token',
            amount: amount.toString(),
        }
        const fee = {
            amount: [{
                denom: 'token',
                amount: '100',
            }, ],
            gas: '200000',
        }
        const result = await client.sendTokens(accounts[0].address, recipient, [amountFinal], fee, "")
        assertIsBroadcastTxSuccess(result)

        if (result.code !== undefined &&
            result.code !== 0) {
            alert("Failed to send tx: " + result.log || result.rawLog);
        } else {
            alert("Succeed to send tx:" + result.transactionHash);
        }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={sendTx}>Send tx</button>
      </header>
    </div>
  );
}

export default App;
