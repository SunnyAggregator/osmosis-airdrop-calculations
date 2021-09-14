import * as fs from "fs";
import { excludedAccounts } from "./excludedAccounts";

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
  unclaimed: Array<{
    denom: string;
    amount: string;
  }>;
};
type ExportStructure = {
  num_accounts: number;
  accounts: Record<string, Account>;
};

const cleanedExport: ExportStructure = JSON.parse(
  fs.readFileSync("./650000_cleaned.json", "utf8")
);

type BalanceMap = Map<string, number>;
const unsortedBalanceMap: BalanceMap = new Map<string, number>();
for (const [address, account] of Object.entries(cleanedExport.accounts)) {
  let total = 0;

  if (!excludedAccounts[address] && account.unclaimed.length === 0) {
    // User must have claimed all their OSMO
    account.balance.forEach((balance) => {
      if (balance.denom === "uosmo") {
        total += Number(balance.amount);
      }
    });

    total += Number(account.staked);
    total += Number(account.unstaked);

    account.bonded.forEach((bond) => {
      if (bond.denom === "uosmo") {
        // Filter out irrelevant assets
        total += Number(bond.amount);
      }
    });
  }

  if (total > 0) {
    unsortedBalanceMap.set(address, total / 10 ** 6);
  }
}

var sortedBalanceMap = new Map(
  [...unsortedBalanceMap].sort((a, b) => a[1] - b[1])
);

// console.log(sortedBalanceMap);

let totalOsmo = 0;

// for (const [address, osmo] of sortedBalanceMap.entries()) {
//   totalOsmo += osmo;
//   console.log(address);
// }

type SunnyMap = Map<string, number>;
let sunnyMap: SunnyMap = new Map();
let total = 0;
for (const [address, osmo] of sortedBalanceMap.entries()) {
  sunnyMap.set(address, 3562);
  total += 3562;
}

// console.log(sunnyMap);
export const part1Airdrop = sunnyMap;
export const part1Total = total;
