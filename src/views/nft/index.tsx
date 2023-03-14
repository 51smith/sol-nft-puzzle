import React, {FC, useEffect, useState} from "react";
import {Metaplex} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import {notify} from "../../utils/notifications";
import {useRouter} from "next/router";
import Image from 'next/image'

const connection = new Connection(clusterApiUrl("devnet"));
const mx = Metaplex.make(connection);

export const NFTView: FC = ({}) => {

    const wallet = useWallet();
    const router = useRouter();

    const address: PublicKey = router.query.id ? new PublicKey(router.query.id) : null;
    const [nft, setNft] = useState(null);

    const fetchNft = async () => {
        const asset = await mx.nfts().findByMint({mintAddress: new PublicKey(address)});
        setNft(asset);
    };

    useEffect(() => {
        if (wallet.publicKey == null) {
            return;
        }
        try {
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
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                    NFT view
                </h1>
                {/* CONTENT GOES HERE */}
                <div className="text-center">
                    <div>
                        <div>
                            <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                                Sol NFT Puzzle: Show NFT</h1>
                            {nft && (
                                <div className="nftPreview">
                                    <h1>{nft.name}</h1>
                                    <Image
                                        src={nft.json.image}
                                        alt={nft.description}
                                        width={512}
                                        height={512}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
