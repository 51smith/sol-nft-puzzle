import type {NextPage} from "next";
import Head from "next/head";
import {MetaplexView} from "../../views";

const MetaplexPage: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Solana NFT Page</title>
                <meta
                    name="description"
                    content="Basic Functionality"
                />
            </Head>
            <MetaplexView/>
        </div>
    );
};

export default MetaplexPage;
