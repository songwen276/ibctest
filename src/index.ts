import { getKeplrFromWindow } from "./getKeplrFromWindow";
import { ChainInfo } from "./constants";
import { SignInfo } from "./signinfo";
import { EthSignType } from "@keplr-wallet/types";
import { createTxRaw } from '@evmos/proto';
import { Chain, Fee, Sender, MessageIBCMsgTransfer, createTxIBCMsgTransfer } from '@tharsis/transactions';
import { toBase64, fromBase64, SecretNetworkClient } from "secretjs";
import Long from "long";
import { TxRaw } from "secretjs/dist/protobuf/cosmos/tx/v1beta1/tx";

const connectWallet = async () => {
  console.log("----start----");
  const keplr = await getKeplrFromWindow();
  if (!keplr) {
    alert("Please install keplr extension");
  } else {
    keplr.experimentalSuggestChain(ChainInfo);
    keplr.enable(ChainInfo.chainId);
    const offlineSigner = keplr.getOfflineSignerOnlyAmino(ChainInfo.chainId);
    console.log("offlineSigner:", offlineSigner);
    const [{ pubkey, address }] = await offlineSigner.getAccounts();
    // const client = new SigningCosmosClient(
    //   ChainInfo.rest,
    //   address,
    //   offlineSigner,
    // );
    // const sequence = (await client).getSequence;
    // console.log("sequence", sequence);
    const pubkeyStr = toBase64(pubkey);
    console.log('Ay81J44MVFCxlodAvzsFOsFgH5PHZdq4+2rOlLCAVJfP', pubkeyStr);
    console.log("address", address);
    const key = await keplr.getKey(ChainInfo.chainId);
    console.log("key:", key.toString());
    const addrss32 = (await key).bech32Address;
    console.log("addrss32:", addrss32);

    // const signInfo = JSON.stringify(SignInfo);
    // console.log("eip712Payload:", signInfo);
    // const signature = await keplr.signEthereum(ChainInfo.chainId, addrss32, signInfo, EthSignType.EIP712)
    // console.log("signature:", signature.toString());

    const chain: Chain = { chainId: 1122, cosmosChainId: 'nim_1122-1' };
    const sender: Sender = { accountAddress: 'nim13lggtz7ftkre3xgkdpfwct9q2kmjplsvxj8sc8', sequence: 27, accountNumber: 454997, pubkey: pubkeyStr };
    const eip712Fee: Fee = { amount: '2092840000000000', denom: 'anim', gas: '509284' };

    // const messages: EncodeObject = [
    //   {
    //     typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
    //     value: {
    //       memo: "{\"eibc\":{\"fee\":\"15000000000000\"}}",
    //       receiver: "dym13lggtz7ftkre3xgkdpfwct9q2kmjplsvqza3kc",
    //       sender: "nim13lggtz7ftkre3xgkdpfwct9q2kmjplsvxj8sc8",
    //       sourceChannel: "channel-0",
    //       sourcePort: "transfer",
    //       timeoutHeight: {
    //         revisionHeight: {
    //           high: 0,
    //           low: 1,
    //           unsigned: false
    //         },
    //         revisionNumber: {
    //           high: 0,
    //           low: 9999,
    //           unsigned: false
    //         }
    //       },
    //       timeoutTimestamp: {
    //         high: 399597017,
    //         low: -265123328,
    //         unsigned: false
    //       },
    //       token: {
    //         amount: "10000000000000000",
    //         denom: "anim"
    //       }
    //     }
    //   }];

    const messages: MessageIBCMsgTransfer = {
      sourcePort: "transfer",
      sourceChannel: "channel-0",
      amount: "100000000000000000",
      denom: "anim",
      receiver: "dym13lggtz7ftkre3xgkdpfwct9q2kmjplsvqza3kc",
      revisionNumber: 0,
      revisionHeight: 0,
      timeoutTimestamp: `${Math.floor(Date.now() / 1000) + 10 * 60
        }000000000`, // 10 minute timeout (ns)
    };
    const memo = "";

    // 创建交易
    const txPayload = createTxIBCMsgTransfer(chain, sender, eip712Fee, memo, messages);
    console.log("txPayload", txPayload);
    const { eipToSign, signDirect } = txPayload;
    console.log("eipToSign", eipToSign);

    // 签名signDirect交易
    const sig = await keplr.signDirect(
      ChainInfo.chainId,
      address,
      {
        bodyBytes:
          signDirect.body.serializeBinary(),
        authInfoBytes:
          signDirect.authInfo.serializeBinary(),
        chainId: ChainInfo.chainId,
        accountNumber: new Long(Number(454997)),
      },
      // @ts-expect-error the types are not updated on the Keplr types package
      { isEthereum: true }
    );

    // 将Evmos交易编码成protobuf binary
    const txRaw = TxRaw.fromPartial({
      body_bytes: sig!.signed.bodyBytes,
      auth_info_bytes: sig!.signed.authInfoBytes,
      signatures: [fromBase64(sig!.signature.signature)],
    });
    const txBytes = TxRaw.encode(txRaw).finish();

    // cosmjs can broadcast to Ethermint but cannot handle the response

    // 创建Evmos连接实例
    const secretjs = new SecretNetworkClient({
      url: ChainInfo.rest,
      chainId: ChainInfo.chainId,
      wallet: offlineSigner,
      walletAddress: address,
    });

    // 广播交易到Evmos
    const tx = await secretjs.tx.broadcastSignedTx(
      txBytes,
      {
        ibcTxsOptions: {
          resolveResponsesCheckIntervalMs: 10_000,
          resolveResponsesTimeoutMs: 10.25 * 60 * 1000,
        },
      }
    );

    if (tx.code !== 0) {
      console.log(`Failed sending to Secret: ${tx.rawLog}`)
    } else {
      const ibcResp = await tx.ibcResponses[0];
      if (ibcResp.type === "ack") {
        console.log('Received on Secret}')
      } else {
        console.log('Timed out while waiting to receive')
      }
    }

  }
}

function main() {
  connectWallet();
  console.log("----end----");
}

main();


