import type {NextPage} from "next";
import Head from "next/head";
import {MetaplexView} from "../views";

const Basics: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Create new Solana NFT</title>
                <meta name="description" content="Basic Functionality"/>
            </Head>
            <MetaplexView/>
        </div>
    );
};

export default Basics;
