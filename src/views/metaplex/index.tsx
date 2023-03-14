import {toMetaplexFile,} from "@metaplex-foundation/js";
import {useWallet} from "@solana/wallet-adapter-react";
import {useMetaplex} from "hooks/useMetaplex";
import React, {FC, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {PublicKey} from "@solana/web3.js";
import {useRouter} from "next/router";
import {notify} from "../../utils/notifications";
import axios from "axios";

interface FormProps {
    name: string;
    description: string;
    image: any;
}

export const MetaplexView: FC = ({}) => {
    const {metaplex: mx} = useMetaplex();
    const wallet = useWallet();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const [nft, setNft] = useState(null);
    const [imageName, setImageName] = useState(null);
    const [newNft, setNewNft] = useState(null);

    const address: PublicKey = router.query.id ? new PublicKey(router.query.id) : null;
    const new_image = router.query.img ? router.query.img : null;

    const fetchNft = async () => {
        const asset = await mx.nfts().findByMint({mintAddress: address});
        setNft(asset);
        setImageName('http://127.0.0.1:8000/' + new_image);
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


    async function createNft(data: FormProps) {
        try {
            const apiClient = axios.create({
                baseURL: process.env.NEXT_PUBLIC_BG_SERVER,
                responseType: "blob",
            });
            apiClient.get(imageName)
                .then(response => {
                    const fileData = new Blob([response.data]);
                    const reader = new FileReader();

                    reader.readAsArrayBuffer(fileData);
                    reader.onload = async function (event) {
                        const arrayBuffer = reader.result;

                        const {uri, metadata} = await mx
                            .nfts()
                            .uploadMetadata({
                                name: data.name,
                                description: data.description,
                                image: toMetaplexFile(arrayBuffer, "metaplex.png"),
                            }).then((res) => {
                                return {uri: res.uri, metadata: res.metadata}
                            });

                        const {nft} = await mx
                            .nfts()
                            .create({
                                uri,
                                name: data.name,
                                sellerFeeBasisPoints: 500,
                            }).then((res) => {
                                return {nft: res.nft}
                            });
                    }
                })
                .catch(e => {
                    console.log(e);
                });

        } catch (error) {
            console.error(error);
        }
    }

    const onSubmit = async (data: FormProps) => {
        const newNFT = await createNft(data);
        setNewNft(newNFT);
    };

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
        <div className="mx-auto p-4 md:hero">
            <div className="flex flex-col md:hero-content">
                <h1 className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text text-center text-5xl font-bold text-transparent">
                    Metaplex
                </h1>

                {/* Create NFT */}
                {nft && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={nft?.name}
                                id="name"
                                className="input input-bordered w-full max-w-xs"
                                {...register("name", {required: true})}
                            />
                            {errors.name && <span>This field is required</span>}
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={nft?.json.description}
                                id="description"
                                className="input input-bordered w-full max-w-xs"
                                {...register("description", {required: true})}
                            />
                            {errors.description && <span>This field is required</span>}
                            <label className="label">
                                <span className="label-text">Image</span>
                            </label>

                            <input
                                type="text"
                                name="image"
                                id="image"
                                value={imageName}
                                className="input input-bordered w-full max-w-xs"
                                {...register("image", {required: true})}
                            />
                            {errors.image && <span>This field is required</span>}
                            <div className="w-full pt-2">
                                <button
                                    className="btn btn-primary w-full animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 "
                                    type="submit">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                )}


                <div>
                    {nft && (
                        <div>
                            <h1>{nft.name}</h1>
                            <img
                                src={imageName}
                                alt="The new illustration of the NFT."
                            />
                        </div>
                    )}
                </div>
                <div>
                    {newNft && (
                        <div>
                            <h1>{newNft.name}</h1>
                            <img
                                src={newNft.json.image}
                                alt="{newNft.json.description}"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
