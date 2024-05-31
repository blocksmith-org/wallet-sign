import {
  NewAddressParams,
  segwitType,
  SignTxParams,
  VerifyMessageParams,
} from "@okxweb3/coin-base";
import { LtcWallet, wif2Public } from "@okxweb3/coin-bitcoin";
import { base } from "@okxweb3/crypto-lib";

export async function sign(mnemonic: string, message: string) {
  let wallet = new LtcWallet();
  let path = await wallet.getDerivedPath({
    index: 0,
    segwitType: segwitType.SEGWIT_NESTED_49,
  });

  let param = {
    mnemonic,
    hdPath: path,
  };
  let privateKey = await wallet.getDerivedPrivateKey(param);

  let publicKey = base.toHex(wif2Public(privateKey, wallet.network()));

  let newParam: NewAddressParams = {
    privateKey,
    addressType: "segwit_nested",
  };
  let address = await wallet.getNewAddress(newParam);
  let signParam: SignTxParams = {
    privateKey,
    data: {
      message,
    },
  };
  let signature = await wallet.signMessage(signParam);
  let verifyParams: VerifyMessageParams = {
    signature,
    data: {
      message,
      publicKey,
    },
  };
  let result = wallet.verifyMessage(verifyParams);
  if (!result) {
    throw new Error("Failed to verify message");
  }

  console.log(`address  : ${address.address}`);
  console.log(`message  : ${message}`);
  console.log(`signature: ${signature}`);
  console.log(`publicKey: ${publicKey}`);
}