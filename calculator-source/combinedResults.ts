import * as fs from "fs";
import { part1Airdrop } from "./part1";
import { part2Airdrop } from "./part2";

type SunnyMap = Map<string, number>;
const combinedResults: SunnyMap = new Map();

for (const [address, SUNNY] of part1Airdrop.entries()) {
  combinedResults.set(address, SUNNY);
}

for (const [address, SUNNY] of part2Airdrop.entries()) {
  if (combinedResults.has(address)) {
    combinedResults.set(address, combinedResults.get(address) + SUNNY);
  } else {
    combinedResults.set(address, SUNNY);
  }
}

// console.log(combinedResults);

var resultsSortedByAmount = new Map(
  [...combinedResults].sort((a, b) => a[1] - b[1])
);

var resultsSortedByAddressAlphabetically = new Map(
  [...combinedResults].sort((a, b) => a[0].localeCompare(b[0]))
);

function saveToFile(sunnyMap: SunnyMap, filename: string) {
  let fileData = "";
  for (const [address, SUNNYAmount] of sunnyMap.entries()) {
    fileData += `${address} ${(
      Math.floor(SUNNYAmount * 1_000_000) / 1_000_000
    ).toFixed(6)} SUNNY\n`;
  }
  fs.writeFileSync(filename, fileData, "utf8");
}

saveToFile(resultsSortedByAmount, "../airdrop-sorted-by-SUNNY-amount.txt");
saveToFile(
  resultsSortedByAddressAlphabetically,
  "../airdrop-sorted-by-address-alphabetically.txt"
);

// console.log(resultsSortedByAmount);
// console.log(resultsSortedByAddressAlphabetically);
