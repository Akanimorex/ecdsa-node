const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const crypto =  require("./crypto");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");




app.use(cors());
app.use(express.json());

const balances = {
  "04dce86a73fba2d6c1eacab0da49fbe30d489eda983076bec37fec576b0432cfab98d0d2d3186f432fb17fdbfe3f1c48d55ba3bdfc0f53131ebaa247106e890aac": 100,
  "04e530a9952b2f6e2555064172baaff75c1022905eeaa64974c0b2819664061317be22bfb275b89f1530f5a88b5a33a3203fc585c4e8ba33f0bfabc2a8b86be004": 50,
  "044bb9687c3c598c49ca4d033e2d09615f04814e34df20ad8138a3a5ef10a2eff151c1a6682af71109b0020acdac313c654448827f67f9d9ab3c2ff0f3153de4e0": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO: get a signature from the client side application
  //recover public address  from the signature
  const { sender, recipient, amount, nonce,  signTxn } = req.body;

  // retrieve the signature and recovery bit 

  const [signature, recoveryBit] = signTxn;

  console.log(signature)

  // converting to uint8Array



  const publicKey = toHex(secp.getPublicKey(sender));

  if(publicKey !== sender ){
    res.status(401).send({message:"Invalid signature"})
  } else {

    setInitialBalance(sender);
    setInitialBalance(recipient);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}




// private key: 902c27c9b56a0eef0c5d8f62aa0470a6e00bf065c766a74de97c6939c61f812e
// public key: 04dce86a73fba2d6c1eacab0da49fbe30d489eda983076bec37fec576b0432cfab98d0d2d3186f432fb17fdbfe3f1c48d55ba3bdfc0f53131ebaa247106e890aac


// private key: b273106b09ffc4c0740f34a1f680652193bcd4ae8f620db6860c68ca2898ed4a
// public key: 04e530a9952b2f6e2555064172baaff75c1022905eeaa64974c0b2819664061317be22bfb275b89f1530f5a88b5a33a3203fc585c4e8ba33f0bfabc2a8b86be004

// private key: 25bd4341995c7692f00e1b65ea8cad19db8bd27ff962877ea2aab8af5c2b7336
// public key: 044bb9687c3c598c49ca4d033e2d09615f04814e34df20ad8138a3a5ef10a2eff151c1a6682af71109b0020acdac313c654448827f67f9d9ab3c2ff0f3153de4e0