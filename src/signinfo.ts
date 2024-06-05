export const SignInfo = {
  "types": {
    "EIP712Domain": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "version",
        "type": "string"
      },
      {
        "name": "chainId",
        "type": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "string"
      },
      {
        "name": "salt",
        "type": "string"
      }
    ],
    "Tx": [
      {
        "name": "account_number",
        "type": "string"
      },
      {
        "name": "chain_id",
        "type": "string"
      },
      {
        "name": "fee",
        "type": "Fee"
      },
      {
        "name": "memo",
        "type": "string"
      },
      {
        "name": "msgs",
        "type": "Msg[]"
      },
      {
        "name": "sequence",
        "type": "string"
      }
    ],
    "Fee": [
      {
        "name": "feePayer",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "Coin[]"
      },
      {
        "name": "gas",
        "type": "string"
      }
    ],
    "Coin": [
      {
        "name": "denom",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "string"
      }
    ],
    "Msg": [
      {
        "name": "type",
        "type": "string"
      },
      {
        "name": "value",
        "type": "MsgValue"
      }
    ],
    "MsgValue": [
      {
        "name": "source_port",
        "type": "string"
      },
      {
        "name": "source_channel",
        "type": "string"
      },
      {
        "name": "token",
        "type": "TypeToken"
      },
      {
        "name": "sender",
        "type": "string"
      },
      {
        "name": "receiver",
        "type": "string"
      },
      {
        "name": "timeout_height",
        "type": "TypeTimeoutHeight"
      },
      {
        "name": "timeout_timestamp",
        "type": "uint64"
      },
      {
        "name": "memo",
        "type": "string"
      }
    ],
    "TypeToken": [
      {
        "name": "denom",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "string"
      }
    ],
    "TypeTimeoutHeight": [
      {
        "name": "revision_number",
        "type": "uint64"
      },
      {
        "name": "revision_height",
        "type": "uint64"
      }
    ]
  },
  "primaryType": "Tx",
  "domain": {
    "name": "Cosmos Web3",
    "version": "1.0.0",
    "chainId": 1122,
    "verifyingContract": "cosmos",
    "salt": "0"
  },
  "message": {
    "account_number": "454997",
    "chain_id": "nim_1122-1",
    "fee": {
      "amount": [
        {
          "amount": "1278450000000000",
          "denom": "anim"
        }
      ],
      "gas": "127845",
      "feePayer": "nim13lggtz7ftkre3xgkdpfwct9q2kmjplsvxj8sc8"
    },
    "memo": "",
    "msgs": [
      {
        "type": "cosmos-sdk/MsgTransfer",
        "value": {
          "receiver": "dym13lggtz7ftkre3xgkdpfwct9q2kmjplsvqza3kc",
          "sender": "nim13lggtz7ftkre3xgkdpfwct9q2kmjplsvxj8sc8",
          "source_channel": "channel-0",
          "source_port": "transfer",
          "timeout_height": {
            "revision_height": "1",
            "revision_number": "9999"
          },
          "timeout_timestamp": "1715679900000000000",
          "token": {
            "amount": "100000000000000000",
            "denom": "anim"
          },
          "memo": "{\"eibc\":{\"fee\":\"150000000000000\"}}"
        }
      }
    ],
    "sequence": "0"
  }
}
