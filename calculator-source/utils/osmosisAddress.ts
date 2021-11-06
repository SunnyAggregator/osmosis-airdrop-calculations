import { bech32 } from "bech32";
import invariant from "tiny-invariant";

export const osmosisAddressToBuffer = (osmosisAddress: string): Buffer => {
  invariant(
    osmosisAddress.length == 43,
    `invalid osmosis address length ${osmosisAddress.length} (expected 43)`
  );

  const words = bech32.decode(osmosisAddress).words;
  invariant(
    words.length == 160 / 5,
    `invalid length ${osmosisAddress.length} (expected 32)`
  );
  return Buffer.from(bech32.fromWords(words));
};
