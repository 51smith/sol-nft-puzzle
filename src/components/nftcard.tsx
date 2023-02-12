import Card from 'react-bootstrap/Card';

import {
    Nft,
} from "@metaplex-foundation/js";
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

                <Link href={/nfts/ + nft.address.toBase58()}> View </Link>

            </Card.Body>
        </Card>
    );
};