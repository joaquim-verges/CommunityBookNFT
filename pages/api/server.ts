import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import "../styles/globals.css";
import { NFT_COLLECTION_ADDRESS } from "../../const/yourDetails";
import { PolygonAmoyTestnet } from '@thirdweb-dev/chains';

const chain = PolygonAmoyTestnet;

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { authorAddress, nftName, image } = JSON.parse(req.body);

    if (!process.env.WALLET_PRIVATE_KEY) {
      throw new Error(
        "You're missing WALLET_PRIVATE_KEY in your .env.local file."
      );
    }

    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.WALLET_PRIVATE_KEY as string,
      "80002",  // Use the correct chain ID for Mumbai Testnet
      { secretKey: process.env.TW_SECRET_KEY }
    );

    const nftCollection = await sdk.getContract(
      NFT_COLLECTION_ADDRESS,
      "nft-collection"
    );

    if (!nftCollection) {
      throw new Error("NFT Collection contract not found");
    }

    const validityStartTimestamp = Math.floor(Date.now() / 1000);
    const validityEndTimestamp = validityStartTimestamp + 24 * 60 * 60;

    const mintRequest = {
      to: authorAddress,
      metadata: {
        name: nftName as string,
        description: "A custom avatar NFT",
        image: image,
        properties: {},
      },
      validityStartTimestamp,
      validityEndTimestamp,
    };

    const signedPayload = await nftCollection.erc721.signature.generate(mintRequest);

    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
  } catch (e) {
    console.error("Server error", e);
    res.status(500).json({ error: `Server error ${e}` });
  }
}
