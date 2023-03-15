import type {NextPage} from "next";
import Head from "next/head";
import {NFTView} from "../../views";

const NFTPage: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Solana NFT Page</title>
                <meta
                    name="Customize your NFT"
                    content="Solana NFT Puzzle game"
                />
            </Head>
            <NFTView/>
        </div>
    );
};

export default NFTPage;
