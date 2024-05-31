import { wordlists } from "@okxweb3/crypto-lib/dist/bip39";
import { config } from "dotenv";
import { sign as signLtc } from "./eth";
import { sign as signEth } from "./ltc";

function validateMnemonic(mnemonic: string): string[] {
    const words = mnemonic.split(" ");
    const invalidWords = words.filter(word => !wordlists['EN'].includes(word));
    return invalidWords;
}


(async () => {
  config();
  let mnemonic = process.env.MNEMONIC!;
  let invalids = validateMnemonic(mnemonic);
  if (invalids.length > 0) {
    console.error(`invalid words: ${invalids}`);
    return
  }

  let message = process.env.MESSAGE!;
  switch (process.env.TOKEN!.toUpperCase()) {
    case "LTC":
        await signLtc(mnemonic, message);
        return;
    case "ETH":
    case "MATIC":
        await signEth(mnemonic, message);
        return;
  }

})().catch((error) => {
  console.error(error);
});