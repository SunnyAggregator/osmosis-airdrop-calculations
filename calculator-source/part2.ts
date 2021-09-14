import * as fs from "fs";
import { part1Total } from "./part1";
// import axios from "axios";

type Account = {
  address: string;
  balance: Array<{
    denom: string;
    amount: string;
  }>;
  staked: string;
  unstaked: string;
  bonded: Array<{
    denom: string;
    amount: string;
  }>;
  // unclaimed_airdrop: Array<{
  //   denom: string;
  //   amount: string;
  // }>;
  total_balances: Array<{
    denom: string;
    amount: string;
  }>;
};
type ExportStructure = {
  num_accounts: number;
  accounts: Record<string, Account>;
};

const cleanedExport: ExportStructure = JSON.parse(
  fs.readFileSync("./898727_cleaned.json", "utf8")
);

// type AssetListStructure = {
//   assets: [
//     {
//       base: string; // "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
//       coingecko_id: string; // "akash-network"
//     }
//   ];
// };
// const osmosisAssetlist: AssetListStructure = JSON.parse(
//   fs.readFileSync("./osmosis-assetlist.json", "utf8")
// );

const coingeckoIdMapping: Record<string, string> = {
  uosmo: "osmosis",
  uion: "ion",
  "ibc/0629E628EA118F587C93777345B624E8A489E7971FBBA4E2DE9A42B7B61A3AF7": "",
  "ibc/0FD5103C7353F0C68F33B60ED7F99B3B5DF90CA947263FFC85BB5A9BEE3060E5": "",
  "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4":
    "akash-network",
  "ibc/1D07F27D2BD5E288D02DDC1A748DCE2CFC8D4D797BD2AA4C4B8C64754AFBB71A": "",
  "ibc/1DCC8A6CB5689018431323953344A9F6CC4D0BFB261E88C9F7777372C10CD076":
    "regen",
  "ibc/262CA88DF3BCAF4B6272D459CBCB519629C9482FFE68772C5703BA87F648000E": "",
  "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2":
    "cosmos",
  "ibc/2F50C5281A464D0C0CCD19C23C049D690F1E9DE927A80B5D9AC69ECF50DBEB27": "",
  "ibc/3B7EE5A86CB8CC652F69BBCE4F09BEF40510D545B5271D9B96F2CA5A417B49BF": "",
  "ibc/3D5D50CFA086097911BD4A90333F72278381EB37E77A5193E46DD1121359C8CD": "",
  "ibc/52B1AA623B34EB78FD767CEA69E8D7FA6C9CFE1FBF49C5406268FD325E2CC2AC":
    "starname",
  "ibc/75D3634612087F3A9F71CE8ECF44E31F2A3992D60A2BFB8F22FF89619AFE08EB": "",
  "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0":
    "iris-network",
  "ibc/81844CA896A4C233B331A468123AF2AACDC580DE294C5528A6E3F661A136795C": "",
  "ibc/95C9DBA947EF31F79732DF74A4C90584E282BF1BC286DEBECBCAF92B204D9DEB": "",
  "ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84":
    "sentinel",
  "ibc/9C8E9CB8CCA8ADB645607543E2B6126FBA8897E3354BF1A9168CCD7EAE79F81A": "",
  "ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293":
    "persistence",
  "ibc/A91B70554A510310B2A068979C8E7A9B433EF689E82A9321922D8A1B845B95F5": "",
  "ibc/AA86CE47A648804E4B95A693958245DA0EB31BD1DB006D9962B9C84CF2C109D3": "",
  "ibc/B78380E9A729CF134E5CC6B55B33777D663FE6EE4DCCB602C1764CDFF16F645D": "",
  "ibc/C8E4FECD7CEF3E76F7754C22CD35E13865932A1A86EAB0A08FE89A2145F7FCFB": "",
  "ibc/CD942F878C80FBE9DEAB8F8E57F592C7252D06335F193635AF002ACBD69139CC": "", // TICK
  "ibc/E2A356F4F26960F49A1E7A3B91EAED52AF5899CF953C1AC6140F281810931BFD": "",
  "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1":
    "crypto-com-chain",
  "ibc/ED0B14BB35A8B29B7524D6E6ED01EEF8EAA2A5B7E560D4FECEFAED33CA52A0D3": "",
  "ibc/F8DDA5E6836FA8AA707F1786824EE8869759A0FD3F146831BD01720684189484": "",
};

// // To help generate coingeckoIdMapping (still needs manual editing)
// for (const [id] of Object.entries(coingeckoIdMapping)) {
//   for (const asset of osmosisAssetlist.assets) {
//     if (asset.base === id) {
//       if (!asset.coingecko_id) {
//         console.log(id, asset);
//       }
//       coingeckoIdMapping[id] = asset.coingecko_id;
//     }
//   }
// }

let coingeckoPriceAtSnapshot: Record<string, number> = {};

// const coingeckoNumericIDMapping: Record<string, number> = {
//   osmosis: 16724,
//   ion: 16731,
//   "akash-network": 12785,
//   regen: 16733,
//   cosmos: 1481,
//   starname: 12660,
//   "iris-network": 5135,
//   sentinel: 14879,
//   persistence: 14582,
//   "crypto-com-chain": 7310,
// };
// const fetchCoingeckoPriceAtSnapshot = async (coingeckoID: string) => {
//   const numericID = coingeckoNumericIDMapping[coingeckoID];
//   const coingeckoCustom = await axios.get(
//     `https://www.coingecko.com/price_charts/${numericID}/usd/custom.json?from=1629842793&to=1629860000`
//   );

//   console.log(coingeckoID, coingeckoCustom.data.stats[0][1]);
//   return coingeckoCustom.data.stats[0][1];
// };
// (async function () {
//   for (const [coingeckoID] of Object.entries(coingeckoNumericIDMapping)) {
//     const price = await fetchCoingeckoPriceAtSnapshot(coingeckoID);
//     coingeckoPriceAtSnapshot[coingeckoID] = price;
//   }
//   console.log(coingeckoPriceAtSnapshot);
// })();

coingeckoPriceAtSnapshot = {
  osmosis: 3.1415772763563075,
  ion: 2354.4997849974156,
  "akash-network": 3.1627243144485786,
  regen: 3.514193373405696,
  cosmos: 20.174398296714514,
  starname: 0.10021430431359446,
  "iris-network": 0.11680946807938254,
  sentinel: 0.025368190486894805,
  persistence: 8.156668842587553,
  "crypto-com-chain": 0.15479648303840876,
};

const denomToPrice = (denom: string) => {
  if (coingeckoIdMapping[denom] === undefined) {
    throw new Error("Unexpected");
  } else if (coingeckoIdMapping[denom] === "") {
    return 0;
  }
  const coingeckoID = coingeckoIdMapping[denom];
  if (coingeckoID === "") {
    return 0;
  }
  return coingeckoPriceAtSnapshot[coingeckoID];
};

const uAmountToUSD = (denom: string, uamount: string) => {
  const amount = Number(uamount) / 10 ** 6;
  return amount * denomToPrice(denom);
};

// Exclude labeled non-user accounts with an explanation
// The labeling comes from a module account list export of the Osmosis blockchain
// Regex: "name": "[^osmo]
const excludedAccounts: Record<string, string> = {
  osmo1yl6hdjhmkf37639730gffanpzndzdpmhxy9ep3: "transfer",
  osmo1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3aq6l09: "bonded_tokens_pool",
  osmo1tygms3xhhs3yv487phx3dw4a95jn7t7lfqxwe3: "not_bonded_tokens_pool",
  osmo1vqy8rqqlydj9wkcyvct9zxl3hc4eqgu3d7hd9k: "developer_vesting_unvested",
  osmo10d07y265gmmuvt4z0w9aw880jnsr700jjeq4qp: "gov",
  osmo1jv65s3grqf6v6jl3dp4t6c9t9rk99cd80yhvld: "distribution",
  osmo1njty28rqtpw6n59sjj4esw76enp4mg6g7cwrhc: "lockup",
  osmo1krxwf5e308jmclyhfd9u92kp369l083wequge6: "incentives",
  osmo1c9y7crgg6y9pfkq0y8mqzknqz84c3etr0kpcvj: "gamm",
  osmo1m5dncvfv7lvpvycr23zja93fecun2kcv226glq: "claim",
  osmo1upfuxznarpja3sywq0tzd2kktg9wv8mcc0rlm9: "poolincentives",
  osmo17xpfvakm2amg962yls6f84z3kell8c5lczssa0: "fee_collector",
};

type BalanceMap = Map<string, number>;
const unsortedBalanceMap: BalanceMap = new Map<string, number>();
let totalUSD = 0;
for (const [address, account] of Object.entries(cleanedExport.accounts)) {
  let totalAirdropUSDForUser = 0;

  // bonded refers to all tokens in LP
  for (const balance of account.bonded) {
    // Count OSMO in LP here for the first time, as well as any other tokens in LP
    totalAirdropUSDForUser += uAmountToUSD(balance.denom, balance.amount);
  }

  for (const balance of account.balance) {
    if (balance.denom === "uosmo") {
      // Count OSMO the second time here
      // balances includes all types of balances including LP, staked, unstaking, liquid
      totalAirdropUSDForUser += uAmountToUSD(balance.denom, balance.amount);
    }
  }

  totalAirdropUSDForUser += uAmountToUSD("uosmo", account.staked);
  totalAirdropUSDForUser += uAmountToUSD("uosmo", account.unstaked);

  // Dust threshold of 10 USD
  // Exclude the Osmosis foundation and module accounts
  if (totalAirdropUSDForUser > 10 && !excludedAccounts[address]) {
    unsortedBalanceMap.set(address, totalAirdropUSDForUser);
    totalUSD += totalAirdropUSDForUser;
  }
}

var sortedBalanceMap = new Map(
  [...unsortedBalanceMap].sort((a, b) => a[1] - b[1])
);

// console.log(sortedBalanceMap);
// console.log(count, totalUSD);

type SunnyMap = Map<string, number>;
let sunnyMap = new Map();

const osmosisAirdropAllocation = 19884700000 * 0.005;
const part2Allocation = osmosisAirdropAllocation - part1Total;
let part2TotalCounter = 0;

for (const [address, usd] of sortedBalanceMap.entries()) {
  const sunnyAmount = (part2Allocation * usd) / totalUSD;

  part2TotalCounter += sunnyAmount;
  sunnyMap.set(address, sunnyAmount);
}

if (
  Math.abs(part2TotalCounter + part1Total - osmosisAirdropAllocation) > 0.0001
) {
  throw new Error("totals dont add up");
}

export const part2Airdrop = sunnyMap;
// export const part2Total = part2TotalCounter;
