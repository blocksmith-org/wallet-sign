import {
  NewAddressParams,
  segwitType,
  SignTxParams,
  VerifyMessageParams,
} from "@okxweb3/coin-base";
import { LtcWallet, wif2Public } from "@okxweb3/coin-bitcoin";
import { base } from "@okxweb3/crypto-lib";
import { config } from "dotenv";

(async () => {
  config();
  let wallet = new LtcWallet();
  let path = await wallet.getDerivedPath({
    index: 0,
    segwitType: segwitType.SEGWIT_NESTED_49,
  });
  let param = {
    mnemonic: process.env.MNEMONIC!,
    hdPath: path,
  };
  let privateKey = await wallet.getDerivedPrivateKey(param);

  let publicKey = base.toHex(wif2Public(privateKey, wallet.network()));

  let newParam: NewAddressParams = {
    privateKey,
    addressType: "segwit_nested",
  };
  let address = await wallet.getNewAddress(newParam);
  console.log(`address  : ${address.address}`);

  let message = process.env.MESSAGE!;
  console.log(`message  : ${process.env.MESSAGE}`);

  let signParam: SignTxParams = {
    privateKey: privateKey,
    data: {
      message,
    },
  };
  let signature = await wallet.signMessage(signParam);
  console.log(`signature: ${signature}`);
  console.log(`publicKey: ${publicKey}`);

  let verifyParams: VerifyMessageParams = {
    signature,
    data: {
      message,
      publicKey,
    },
  };
  let result = await wallet.verifyMessage(verifyParams);
  if (!result) {
    throw new Error("Failed to verify message");
  }
})().catch((error) => {
  console.error(error);
});
