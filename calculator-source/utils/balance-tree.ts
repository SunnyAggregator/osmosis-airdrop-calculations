import { u64 } from "@saberhq/token-utils";
import type BN from "bn.js";
import { keccak_256 } from "js-sha3";

import { MerkleTree } from "./merkle-tree";

export class BalanceTree {
  private readonly tree: MerkleTree;
  constructor(balances: { account: Buffer; amount: BN }[]) {
    this.tree = new MerkleTree(
      balances.map(({ account, amount }, index) => {
        return BalanceTree.toNode(index, account, amount);
      })
    );
  }

  public static verifyProof(
    index: number,
    account: Buffer,
    amount: BN,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(index, account, amount);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  // keccak256(abi.encode(index, account, amount))
  public static toNode(index: number, account: Buffer, amount: BN): Buffer {
    const buf = Buffer.concat([
      new u64(index).toArrayLike(Buffer, "le", 8),
      account,
      new u64(amount).toArrayLike(Buffer, "le", 8),
    ]);
    return Buffer.from(keccak_256(buf), "hex");
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  public getHexProof(index: number, account: Buffer, amount: BN): string[] {
    return this.tree.getHexProof(BalanceTree.toNode(index, account, amount));
  }

  public getRoot(): Buffer {
    return this.tree.getRoot();
  }

  public getProof(index: number, account: Buffer, amount: BN): Buffer[] {
    return this.tree.getProof(BalanceTree.toNode(index, account, amount));
  }
}
