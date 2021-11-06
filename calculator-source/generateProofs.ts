import { u64 } from "@saberhq/token-utils";
import BN from "bn.js";
import * as fs from "fs";
import { BalanceTree } from "./utils/balance-tree";
import { osmosisAddressToBuffer } from "./utils/osmosisAddress";

// The merkle proof json files are generated then saved to airdrop-artifacts
const airdropTxt = fs.readFileSync(
  "../airdrop-sorted-by-SUNNY-amount.txt",
  "utf8"
);

const ZERO = new BN(0);

// Each line is in the format of:
//   osmo1pvxhtre74l37p6y2rs2e8xyek75z7xlc7g2trt 123 SUNNY
let airdropRecipients: {
  address: string;
  balanceTreeArg: {
    address: Buffer;
    amount: BN;
  };
}[] = [];

airdropTxt.split("\n").forEach((line) => {
  const [address, amount] = line.split(" ");

  // Remove foundation tokens from the recipients list because multisig is not supported
  // They will receive their tokens through a separate method
  if (
    address === "osmo1pvxhtre74l37p6y2rs2e8xyek75z7xlc7g2trt" ||
    address === ""
  ) {
    return;
  }

  const amount64 = new u64(Number(amount) * 1000000);

  airdropRecipients.push({
    address,
    balanceTreeArg: {
      address:
        address !== "" ? osmosisAddressToBuffer(address) : Buffer.alloc(0),
      amount: new BN(amount64, 10),
    },
  });
});

// Allow some test accounts to receive 0.0001 SUNNY
// These tokens will never be moved or sold after claiming. They are only to be
// used for testing to make sure the airdrop works
const testAccounts = [
  "osmo1fuqed6c09et48lq3cam0v5w2gkl8jmzkpxq9rp",
  "osmo1fsh5tllfk7urf20lsvhakwj7k9sn0w5gdqsv4j",
  "osmo15at0lklrmxc26dgxg67afd499ryey53afkh87f",
  "osmo12l7ed28cf3xwjjcr3njkq0p0plrr946ylepum3",
  "osmo1pkd0d84gczhsaermraljexqdl7cu4zzpdzx5k0",
  "osmo1jwn05gxjjtxhepenzvs3xlqvtyt6tndlf052kc",
  "osmo1tclr3f43m4mauqj6fcnnw4fd9cguj6kl68kj3y",
];

// Add each element of testAccounts to airdropRecipients where testAccounts is address and amount
testAccounts.forEach((testAccount) => {
  airdropRecipients.push({
    address: testAccount,
    balanceTreeArg: {
      address: osmosisAddressToBuffer(testAccount),
      amount: new BN(100, 10), // "100" is 0.0001 SUNNY
    },
  });
});

// Sum the amount in airdropRecipients
let totalAirdropAmount = new BN(0);
airdropRecipients.forEach((acc) => {
  if (!acc.balanceTreeArg.amount.gt(ZERO)) {
    console.log(acc.balanceTreeArg.amount);
    console.log("Encountered amount not greater than 0");
    process.exit();
  }
  totalAirdropAmount = totalAirdropAmount.add(acc.balanceTreeArg.amount);
});

console.log("Total airdrop amount:", totalAirdropAmount.toString());
console.log(
  "Total airdrop SUNNY:",
  Number(totalAirdropAmount.div(new BN(1000000, 10)).toString())
);
console.log("Total recipients:", airdropRecipients.length);

const tree = new BalanceTree(
  airdropRecipients.map((drop) => {
    return {
      account: osmosisAddressToBuffer(drop.address),
      amount: drop.balanceTreeArg.amount,
    };
  })
);

console.log("Tree root:", tree.getHexRoot());

const main = async () => {
  try {
    fs.rmSync("../proofs/", { recursive: true });
  } catch (e) {}
  fs.mkdirSync("../proofs/", { recursive: true });
  await Promise.all(
    airdropRecipients.map(
      (drop, index) =>
        new Promise<void>((resolve) => {
          const proof = tree.getProof(
            index,
            osmosisAddressToBuffer(drop.address),
            drop.balanceTreeArg.amount
          );
          fs.writeFile(
            `../proofs/${drop.address}.json`,
            JSON.stringify({
              index,
              amount: drop.balanceTreeArg.amount.toString(),
              proof: proof.map((p) => p.toString("hex")),
            }) + "\n",
            () => {
              resolve();
            }
          );
        })
    )
  );
};

main().catch((err) => console.error(err));
