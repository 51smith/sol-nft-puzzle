import React, {useState} from "react";
import Tile from "./Tile";
import {BOARD_SIZE, GRID_SIZE, TILE_COUNT} from "./constants"
import {canSwap, isSolved, shuffle, swap} from "./puzzlehelpers"
import {Nft} from "@metaplex-foundation/js";
import useBackgrounds from "../../hooks/useBackgrounds";
import apiClient from "../../utils/http-common";
import * as process from "process";


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
                        setImage(process.env.NEXT_PUBLIC_BG_SERVER + response.data.path);
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

        <div className={"content-center flex-col m-2"}>


            <div className="board content-center">
                <ul style={style} className="board content-center">
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
            </div>
            <div className="flex flex-col justify-center">
                {hasWon && isStarted && <div>Puzzle solved 🧠 🎉</div>}

                {!isStarted ?
                    (<button
                        className={"content-center flex-col m-2 btn btn-primary w-full animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 "}
                        onClick={() => handleStartClick()}>Start game</button>) :
                    (<button
                        className={"content-center flex-col m-2 btn btn-primary w-full animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 "}
                        onClick={() => handleShuffleClick()}>Restart game</button>)}
                <button
                    className={"content-center flex-col m-2 btn btn-primary w-full animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 "}
                    onClick={() => createNewBackground()}>New Background
                </button>

            </div>
        </div>
    );
}
