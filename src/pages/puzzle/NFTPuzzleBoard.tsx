import React, {useState} from "react";
import Tile from "./Tile";
import {BOARD_SIZE, GRID_SIZE, TILE_COUNT} from "./constants"
import {canSwap, isSolved, shuffle, swap} from "./puzzlehelpers"
import {Nft} from "@metaplex-foundation/js";
import Image from 'next/image'
import useBackgrounds from "../../hooks/useBackgrounds";
import apiClient from "../../utils/http-common";


export default function NFTPuzzleBoard(props: { nft: Nft }) {
    const nft = props.nft;
    const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
    const [isStarted, setIsStarted] = useState(false);
    const [image, setImage] = useState(nft.json.image);

    const {backgrounds, isLoading, isError} = useBackgrounds();
    const getRandomBackground = () => {
        return backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }

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


    function createNewBackground() {
        const newBackground = {url: nft.json.image, background: getRandomBackground()};

        console.log(newBackground);
        apiClient.post('create_new_nft_image', newBackground)
            .then(response => {
                    try {
                        console.log(response.data.path);
                        console.log(process.env);
                        setImage("http://127.0.0.1:8000/" + response.data.path);
                    } catch (e) {
                        console.log(e)
                    }
                }
            )
            .catch(error => console.log(error));
        ;

    }

    const pieceWidth = Math.round(BOARD_SIZE / GRID_SIZE);
    const pieceHeight = Math.round(BOARD_SIZE / GRID_SIZE);
    const style = {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
    };
    const hasWon = isSolved(tiles)

    return (

        <div className={"content-center m-2"}>
            <div className={" border-l-orange-100"}>
                {hasWon && isStarted && <div>Puzzle solved 🧠 🎉</div>}

                {!isStarted ?
                    (<button onClick={() => handleStartClick()}>Start game</button>) :
                    (<button onClick={() => handleShuffleClick()}>Restart game</button>)}
                <button onClick={() => createNewBackground()}>New Background</button>
                <div><Image src={image} alt={nft.name} width={200} height={200}/></div>

            </div>


            <div>
                <ul style={style} className="board">
                    {tiles.map((tile, index) => (
                        <Tile
                            key={tile}
                            index={index}
                            imgUrl={image}
                            tile={tile}
                            width={pieceWidth}
                            height={pieceHeight}
                            handleTileClick={handleTileClick}
                        />
                    ))}
                </ul>
                <div>Click on a tile to move it</div>
            </div>

        </div>
    );
}
