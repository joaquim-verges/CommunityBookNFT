import styles from "./styles/Home.module.css";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useNFTs,
  Web3Button,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useState, useRef } from "react";
import { NFT_COLLECTION_ADDRESS } from "../const/yourDetails";
import AvatarCanvas from "../components/AvatarCanvas";

const Home: NextPage = () => {
  const address = useAddress();

  // Fetch the NFT collection from thirdweb via its contract address.
  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );

  // Load all the minted NFTs in the collection
  const { data: nfts, isLoading: loadingNfts } = useNFTs(nftCollection);

  // Here we store the user inputs for their NFT.
  const [nftName, setNftName] = useState<string>("");
  const [hairStyle, setHairStyle] = useState<string>("short");

  const canvasRef = useRef<any>();

  // This function calls a Next JS API route that mints an NFT with signature-based minting.
  // We send in the address of the current user, and the text they entered as part of the request.
  const mintWithSignature = async () => {
    try {
      // Take a screenshot of the avatar from the canvas
      const image = await canvasRef.current.takeScreenshot();

      // Make a request to /api/server
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          authorAddress: address, // Address of the current user
          nftName: nftName || "",
          image: image,
        }),
      });

      // Grab the JSON from the response
      const json = await signedPayloadReq.json();

      if (!signedPayloadReq.ok) {
        alert(json.error);
        return;
      }

      // If the request succeeded, we'll get the signed payload from the response.
      const signedPayload = json.signedPayload;

      // Add null/undefined check for signedPayload
      if (!signedPayload) {
        alert("Failed to get signed payload.");
        return;
      }

      // Now we can call signature.mint and pass in the signed payload that we received from the server.
      const nft = await nftCollection?.signature.mint(signedPayload);

      alert("Minted successfully!");

      return nft;
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Avatar Minting</h1>
      <p className={styles.explain}>
        Create and mint your custom avatar with{" "}
        <b>
          {" "}
          <a
            href="https://thirdweb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.purple}
          >
            thirdweb
          </a>
        </b>{" "}
        + Next.JS.
      </p>

      <hr className={styles.divider} />

      <div className={styles.collectionContainer}>
        <h2 className={styles.ourCollection}>Mint your own Avatar NFT:</h2>

        <input
          type="text"
          placeholder="Name of your NFT"
          className={styles.textInput}
          maxLength={26}
          onChange={(e) => setNftName(e.target.value)}
        />

        <div>
          <label>
            <input
              type="radio"
              value="short"
              checked={hairStyle === "short"}
              onChange={() => setHairStyle("short")}
            />
            Short Hair
          </label>
          <label>
            <input
              type="radio"
              value="long"
              checked={hairStyle === "long"}
              onChange={() => setHairStyle("long")}
            />
            Long Hair
          </label>
          <label>
            <input
              type="radio"
              value="bald"
              checked={hairStyle === "bald"}
              onChange={() => setHairStyle("bald")}
            />
            Bald
          </label>
        </div>

        <AvatarCanvas hairStyle={hairStyle} ref={canvasRef} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Web3Button
          contractAddress={NFT_COLLECTION_ADDRESS}
          action={() => mintWithSignature()}
        >
          Mint NFT
        </Web3Button>
      </div>

      <hr className={styles.smallDivider} />

      <div className={styles.collectionContainer}>
        <h2 className={styles.ourCollection}>Other NFTs in this collection:</h2>

        {loadingNfts ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.nftGrid}>
            {nfts?.map((nft) => (
              <div className={styles.nftItem} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  style={{ width: 200, height: 200 }}
                />
                <div style={{ textAlign: "center" }}>
                  <p>Name</p>
                  <p>
                    <b>{nft.metadata.name}</b>
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <p>Owned by</p>
                  <p>
                    <b>
                      {nft.owner
                        .slice(0, 6)
                        .concat("...")
                        .concat(nft.owner.slice(-4))}
                    </b>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
