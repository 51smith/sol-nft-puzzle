import React, {FC, useEffect, useState} from "react";
import {
    JsonMetadata,
    LoadMetadataInput,
    Metadata,
    Metaplex,
    Mint,
    Nft,
    NftEdition,
    Pda,
    Sft
} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import {notify} from "../../utils/notifications";
import NFTCard from "../../components/nftcard";

const connection = new Connection(clusterApiUrl("devnet"));
const mx = Metaplex.make(connection);

export const NFTSView: FC = ({}) => {

    const wallet = useWallet();
    const tmpNftArray: Nft[] = [];
    const [allNFTs, setAllNFTs] = useState(tmpNftArray);

    const fetchAllNFTs = async (publicKey) => {

        try {
            if (!publicKey) return;
            return await mx.nfts().findAllByOwner({owner: publicKey});
        } catch (e) {
            console.log(e);
        }
    };

    const fetchNFT = async (metadata: Metadata | Nft | Sft): Promise<Nft> => {
        return await mx.nfts().load({metadata} as LoadMetadataInput) as
            Omit<Metadata<JsonMetadata>, "model" | "address" | "mintAddress"> &
            { readonly model: "nft"; readonly address: PublicKey; readonly metadataAddress: Pda; readonly mint: Mint; readonly edition: NftEdition };
    }

    useEffect(() => {
        if(wallet.publicKey == null) {
            return;
        }
        try {
            fetchAllNFTs(wallet.publicKey).then((allMetadata) => {
                setAllNFTs([]);//clear previous NFTs, in case of fast reload / wallet switch etc..
                allMetadata.forEach((metadata) => {
                    fetchNFT(metadata).then((nft) => {
                        setAllNFTs((allNFTs) => [...allNFTs, nft]);
                    });
                });
            });
        } catch (e) {
            notify({ type: 'error', message: `Nft loading failed!`, description: e?.message });
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
                {/* CONTENT GOES HERE */}
                <div className="text-center">
                    <div>
                        <div >
                            <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                                All your NFT&apos;s</h1>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}>
                                {allNFTs.map((nft) => (<NFTCard key={nft.address} nft={nft}></NFTCard>))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
