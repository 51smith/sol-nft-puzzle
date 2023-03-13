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
    const [image, setImage] = useState(null);

    const fetchNft = async () => {
        //TODO, check ownership?
        const asset = await mx.nfts().findByMint({mintAddress: new PublicKey(address)});
        setNft(asset);
        setImage(asset.json.image);
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
        console.log("No wallet connected");
    }


    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                    NFT view
                </h1>
                <div className="text-center">
                    <div>
                        <div>
                            <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                                All your NFT&amp;apos s are belong to us:</h1>
                            {nft && (
                                <div className="nft Puzzle">
                                    <h1>{nft.name}</h1>
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
