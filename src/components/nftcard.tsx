import Card from 'react-bootstrap/Card';

import {Nft,} from "@metaplex-foundation/js";
import React from 'react';
import Link from "next/link";


export default function Nftcard(props: { key: any, nft: Nft }) {
    const nft = props.nft;
    if (nft == null) return (<div></div>);
    return (
        <Card style={{width: '10rem', padding: '15pt'}}>
            <Card.Img variant="top" src={nft.json.image}/>
            <Card.Body>
                <Card.Title>{nft.name}</Card.Title>
                <Card.Text>
                    {nft.json.description}
                </Card.Text>

                <div
                    className="content-center flex-col m-2 btn btn-primary w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500">
                    <Link
                        href={/puzzle/ + nft.address.toBase58()}> Puzzle </Link></div>
                <div
                    className="content-center flex-col m-2 btn btn-primary w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500">
                    <Link
                        href={/new_background/ + nft.address.toBase58()}> Customize </Link></div>
            </Card.Body>
        </Card>
    );
};