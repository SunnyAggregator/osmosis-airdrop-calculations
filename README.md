# SUNNY airdrop to Osmosis holders

In October, the SUNNY airdrop claim to Osmosis holders will be available. To check how many SUNNY tokens you will be able to claim, see [airdrop-sorted-by-address-alphabetically.txt](./airdrop-sorted-by-address-alphabetically.txt) and search for your address.

## Relevant blog posts

- [Sunny announces airdrop to Osmosis (OSMO) holders](https://medium.com/sunny-aggregator/sunny-announces-airdrop-to-osmosis-osmo-holders-6e787c4502ac)

## Verifying behind the scenes

The source code used to calculate the SUNNY airdrop amount is published here for transparency. If any mistakes in the derivation are found before the airdrop is uploaded to the Solana blockchain, the amounts will be amended. The airdrop will be final after upload. 

Prices used to calculate the airdrop USD total were taken from CoinGecko at the snapshot time. For more details on how the exact amount of USD value per user is calculated, see the blog post titled [Sunny announces airdrop to Osmosis (OSMO) holders](https://medium.com/sunny-aggregator/sunny-announces-airdrop-to-osmosis-osmo-holders-6e787c4502ac).

Instructions:

- Download and install Node.js
- Download this git repostory
- In your terminal go inside `calculator-source`
- `npm install`
- `npm install -g ts-node`
- `ts-node combinedResults.ts`
