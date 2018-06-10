const fs = require("fs");
const eosic = require("eosic");
const binaryen = require("binaryen");
const Eos = require("eosjs");
const base58 = require("bs58");
const { ecc } = Eos.modules;

const [pub, wif] = [
  "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
];
const eos = Eos({
  keyProvider: wif,
  binaryen
});

describe("contentFeed", () => {
  it("should print hash", async () => {
    require("signale").info("start test case");
    wasm = fs.readFileSync("contracts/contentFeed/contentFeed.wasm");
    abi = fs.readFileSync("contracts/contentFeed/contentFeed.abi");

    const contractWif = ecc.seedPrivate(Math.random().toString());
    const contractPub = ecc.privateToPublic(wif);
    const account = await eos.newaccount({
      creator: "eosio",
      name: "contentfeed",
      owner: contractPub,
      active: contractPub
    });

    await eos.transaction(tr => {
      tr.setcode("contentfeed", 0, 0, wasm);
      tr.setabi("contentfeed", JSON.parse(abi));
    });

    require("signale").info("load contract");
    const instance = await eos.contract("contentfeed");
    require("signale").info("interact with a contract");
    require("signale").info(ecc.sha256("test content"));
    require("signale").info(ecc.signHash(ecc.sha256("test content"), wif));
    require("signale").info(
      ecc
        .PublicKey(pub)
        .toBuffer()
        .toString("hex")
    );
    const response = await instance.add(
      "testfeed",
      "eosio",
      0,
      "test content",
      ecc.signHash(ecc.sha256("test content"), wif),
      {
        authorization: "eosio"
      }
    );

    console.log(
      (await eos.getAccount("eosio")).permissions.map(p => p.required_auth.keys)
    );

    console.log(
      await eos.getTableRows(true, "contentfeed", "testfeed", "contentnode")
    );

    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
