// Exclude labeled non-user accounts with an explanation
// The labeling comes from a module account list export of the Osmosis blockchain
// Regex: "name": "[^osmo]
export const excludedAccounts: Record<string, string> = {
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
