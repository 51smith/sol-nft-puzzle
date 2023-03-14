import React, {FC, useEffect, useState} from "react";
import {Metaplex} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import {notify} from "../../utils/notifications";
import {useRouter} from "next/router";
import Image from 'next/image'
import useBackgrounds from "../../hooks/useBackgrounds";
import apiClient from "../../utils/http-common";
import * as process from "process";
import Link from "next/link";

const connection = new Connection(clusterApiUrl("devnet"));
const mx = Metaplex.make(connection);

//const cors = require("cors");

export const NFTViewNewBackground: FC = ({}) => {

    const wallet = useWallet();
    const router = useRouter();
    const {backgrounds, isLoading, isError} = useBackgrounds();
    const getRandomBackground = () => {
        return backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }

    const address: PublicKey = router.query.id ? new PublicKey(router.query.id) : null;
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState(null);
    const [nft, setNft] = useState(null);
    const [isNewBackground, setIsNewBackground] = useState(false);


    const fetchNft = async () => {
        const asset = await mx.nfts().findByMint({mintAddress: new PublicKey(address)});
        setImage(asset.json.image);
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


    function createNewBackground(image) {
        const newBackground = {url: image, background: getRandomBackground()};
        console.log(newBackground);
        apiClient.post('create_new_nft_image', newBackground)
            .then(response => {
                    try {
                        console.log(response.data.path);
                        console.log(process.env.NEXT_PUBLIC_BG_SERVER);
                        setImage(process.env.NEXT_PUBLIC_BG_SERVER + response.data.path);
                        console.log(image);
                        setImageName(response.data.path);
                        setIsNewBackground(true);
                    } catch (e) {
                        console.log(e)
                    }
                }
            )
            .catch(error => console.log(error));
        ;


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
                                All your NFT&apos;s are belong to us:</h1>
                            {nft && (
                                <div className="nftPreview">
                                    <h1>{nft.name}</h1>
                                    <Image
                                        src={image}
                                        alt={nft.description}
                                        width={512}
                                        height={512}
                                    />
                                    <div>
                                        <button className="btn btn-primary" onClick={() => {
                                            createNewBackground(nft.json.image)
                                        }}>New NFT Background
                                        </button>
                                    </div>
                                    {isNewBackground && (
                                        <div className=" btn btn-primary "><Link
                                            href={/metaplex/ + nft.address.toBase58() + "?img=" + imageName}> Create
                                            NFT </Link></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
