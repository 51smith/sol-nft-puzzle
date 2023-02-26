import React, {useState} from "react";
import Tile from "./Tile";
import {BOARD_SIZE, GRID_SIZE, TILE_COUNT} from "./constants"
import {canSwap, isSolved, shuffle, swap} from "./puzzlehelpers"
import {Nft} from "@metaplex-foundation/js";
import Image from 'next/image'

export default function NFTPuzzleBoard(props: { nft: Nft }) {
    const nft = props.nft;
    const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
    const [isStarted, setIsStarted] = useState(false);
    console.log('is started:', isStarted)

    const shuffleTiles = () => {
        const shuffledTiles = shuffle(tiles)
        setTiles(shuffledTiles);
    }

    const swapTiles = (tileIndex) => {
        if (canSwap(tileIndex, tiles.indexOf(tiles.length - 1))) {
            const swappedTiles = swap(tiles, tileIndex, tiles.indexOf(tiles.length - 1))
            setTiles(swappedTiles)
        }
    }

    const handleTileClick = (index) => {
        swapTiles(index)
    }

    const handleShuffleClick = () => {
        shuffleTiles()
    }

    const handleStartClick = () => {
        shuffleTiles()
        setIsStarted(true)
    }

    const pieceWidth = Math.round(BOARD_SIZE / GRID_SIZE);
    const pieceHeight = Math.round(BOARD_SIZE / GRID_SIZE);
    const style = {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
    };
    const hasWon = isSolved(tiles)

    return (
        <div>

            <div><Image src={nft.json.image} alt={nft.name} width={200} height={200}/></div>
            <div>Click on a tile to move it</div>
            <ul style={style} className="board">
                {tiles.map((tile, index) => (
                    <Tile
                        key={tile}
                        index={index}
                        imgUrl={nft.json.image}
                        tile={tile}
                        width={pieceWidth}
                        height={pieceHeight}
                        handleTileClick={handleTileClick}
                    />
                ))}
            </ul>


            {hasWon && isStarted && <div>Puzzle solved 🧠 🎉</div>}

            {!isStarted ?
                (<button onClick={() => handleStartClick()}>Start game</button>) :
                (<button onClick={() => handleShuffleClick()}>Restart game</button>)}
        </div>
    );
}
