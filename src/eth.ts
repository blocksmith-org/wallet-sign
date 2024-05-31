import { NewAddressParams, SignTxParams, VerifyMessageParams } from "@okxweb3/coin-base";
import { EthWallet, MessageTypes } from "@okxweb3/coin-ethereum"

export async function sign(mnemonic: string, message: string) {
  let wallet = new EthWallet();
  let path = await wallet.getDerivedPath({
    index: 0,
  });

  let param = {
    mnemonic,
    hdPath: path,
  };
  let privateKey = await wallet.getDerivedPrivateKey(param);

  let type = MessageTypes.ETH_SIGN;
  let newParam: NewAddressParams = {
    privateKey,
  };
  let address = await wallet.getNewAddress(newParam);
  let signParam: SignTxParams = {
    privateKey,
    data: {
      message,
      type,
    },
  };
  let signature = await wallet.signMessage(signParam);

  let verifyParams: VerifyMessageParams = {
    signature,
    address: address.address,
    data: {
      type,
      message,
      address: address.address,
    },
  };
  let result = wallet.verifyMessage(verifyParams);
  if (!result) {
    throw new Error("Failed to verify message");
  }

  console.log(`address  : ${address.address}`);
  console.log(`message  : ${message}`);
  console.log(`signature: ${signature}`);
}