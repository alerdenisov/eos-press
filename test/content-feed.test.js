const fs = require("fs");
const eosic = require("eosic");
const binaryen = require("binaryen");
const Eos = require("eosjs");

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
    wasm = fs.readFileSync("contracts/contentFeed/contentFeed.wasm");
    abi = fs.readFileSync("contracts/contentFeed/contentFeed.abi");

    const contractWif = Eos.modules.ecc.seedPrivate(Math.random().toString());
    const contractPub = Eos.modules.ecc.privateToPublic(wif);
    const account = await eos.newaccount({
      creator: "eosio",
      name: "contentfeed",
      owner: contractPub,
      active: contractPub
    });

    console.log(
      await eos.transaction(tr => {
        tr.setcode("contentfeed", 0, 0, wasm);
        tr.setabi("contentfeed", JSON.parse(abi));
      })
    );

    const instance = await eos.contract("contentfeed");
    instance.add("eosio", 0, "test content", "test sig");
  });
});
