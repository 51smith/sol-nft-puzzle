import type {NextPage} from "next";
import Head from "next/head";
import {NFTSView} from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
        <Head>
            <title>Sol Puzzle</title>
            <meta
                name="Customize your NFT"
                content="Solana NFT Puzzle game"
            />
        </Head>
        <NFTSView/>
    </div>
  );
};

export default Home;
