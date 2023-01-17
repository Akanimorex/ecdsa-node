import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setprivateKey }) {
  async function onChange(evt) {
    const inputKey = evt.target.value;
    console.log(inputKey, "private key");
    setprivateKey(inputKey);
    const convertedAddress = toHex(secp.getPublicKey(inputKey));
    setAddress(convertedAddress);
    
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key 
        <input placeholder="Type in your private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <div>Address:{address.slice(0,10)}...</div>
    </div>
  );
}

export default Wallet;
