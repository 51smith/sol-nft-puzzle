import React, {FC, useEffect, useState} from "react";
import {Metaplex} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import {notify} from "../../utils/notifications";
import {useRouter} from "next/router";
import NFTPuzzleBoard from "../../pages/puzzle/NFTPuzzleBoard";

const connection = new Connection(clusterApiUrl("devnet"));
const mx = Metaplex.make(connection);

export const NFTPuzzleView: FC = ({}) => {

    const wallet = useWallet();
    const router = useRouter();

    const address: PublicKey = router.query.id ? new PublicKey(router.query.id) : null;
    const [nft, setNft] = useState(null);
    const [nftName, setNftName] = useState("NFT");

    const fetchNft = async () => {
        //TODO, check ownership?
        const asset = await mx.nfts().findByMint({mintAddress: new PublicKey(address)});
        setNft(asset);
        setNftName(asset.name);

    };

    useEffect(() => {
        if (wallet.publicKey == null) {
            return;
        }
        try {
            //ToDO, check if i should use react query?
            // multiple dependencies: wallet, and metaplex result
            fetchNft();
        } catch (e) {
            notify({type: 'error', message: `Nft loading failed!`, description: e?.message});
        }
    }, [wallet.publicKey]);

    if (!wallet.publicKey) {
        return (
            <div className="mx-auto p-4 md:hero">
                <div className="flex flex-col md:hero-content">
                    <h1 className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text text-center text-5xl font-bold text-transparent">
                        Wallet Not Connected
                    </h1>
                </div>
            </div>
        );
    }


    return (
        <div className="md:hero mx-auto p-4 h-screen">
            <div className="md:hero-content flex flex-col">
                <div className="text-center">
                    <div>
                        <div>
                            <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                                Play with your {nftName}</h1>
                            {nft && (
                                <div className="nft Puzzle">

                                    <NFTPuzzleBoard nft={nft}/>
                                </div>

                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
