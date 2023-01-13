const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "045da533521b6626cca729fa196547ef33266a50ec8c5f86fb3383a154cce8bc4203629cdb62529cdadf2129aabd9daee829db6274d2ab6221f32f9b9b9d684171": 100,
  "040bae82bef127d1ed6913dc41699952aa40fea862e2046ebb19de1002a6df3b05c27742fa5a552f505653deb6d413824f88509739d6c329361bee21eed874b7b6": 50,
  "0477ce9558849782c7a36a46975a11b01bc4376891db1d29051b9b8d77bc6c710435acae1317275539ffb7e861f5415e0175cc379b1e2fcef3c1040f5bf39f1fa4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
