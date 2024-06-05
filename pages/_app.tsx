import { ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "./styles/globals.css";
import { PolygonAmoyTestnet } from '@thirdweb-dev/chains';

const chain = PolygonAmoyTestnet

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={chain}
    clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
      <Head>
        <title>Avatar App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="thirdweb Example Repository to Showcase signature based minting on an NFT Collection contract"
        />
        <meta name="keywords" content="thirdweb signature based minting" />
      </Head>
      <Component {...pageProps} />
      
    </ThirdwebProvider>
  );
}

export default MyApp;
