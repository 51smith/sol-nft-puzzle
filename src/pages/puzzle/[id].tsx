import type {NextPage} from "next";
import Head from "next/head";
import {NFTPuzzleView} from "../../views";

const NFTPuzzle: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Solana NFT Puzzle view</title>
                <meta
                    name="slider puzzle"
                    content="Basic slider puzzle"
                />
            </Head>
            <NFTPuzzleView/>
        </div>
    );
};

export default NFTPuzzle;
