import type {NextPage} from "next";
import Head from "next/head";
import {NFTSView} from "../views";

const NFTList: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Solana Scaffold</title>
                <meta
                    name="description"
                    content="Basic Functionality"
                />
            </Head>
            <NFTSView/>
        </div>
    );
};

export default NFTList;
