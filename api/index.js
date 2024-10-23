const { ethers } = require("ethers");
const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("CRYPTOXAPI");
});

/**
 * Transfer XCOIN from one wallet to another
 * req.body = { to: "", amount: "(in ETH)" }
 * headers = { "private-key": "" }
 */
app.post("/xcoin/transfer", async (req, res) => {
  const { to, amount } = req.body;
  const privateKey = req.headers["private-key"];
  if (!privateKey || !to || !amount) {
    res.sendStatus(404).send("Missing parameters");
  }
  try {
    const provider = new ethers.JsonRpcProvider(
      "https://rpc-xcoin.cryptoxnetwork.io/"
    );
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });
    const receipt = await tx.wait();
    res.sendStatus(200).send(receipt);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`server: listening on port ${port}`);
});
