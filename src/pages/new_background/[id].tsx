import type {NextPage} from "next";
import Head from "next/head";
import {NFTViewNewBackground} from "../../views";

const NFTPage: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Solana NFT New Background</title>
                <meta
                    name="description"
                    content="Basic Functionality"
                />
            </Head>
            <NFTViewNewBackground/>
        </div>
    );
};

export default NFTPage;
