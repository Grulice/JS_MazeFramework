import { ECellType } from "./types";

export const CELL_TYPE_STYLES: { [k in ECellType]: string } = {
    [ECellType.EMPTY]: "cell-empty", // empty
    [ECellType.WALL]: "cell-wall", // wall
    [ECellType.START]: "cell-start", // start
    [ECellType.END]: "cell-end", // end
    [ECellType.PATH]: "cell-path", // path
};

export const RANDOM_MAZE_API_BASEURL =
    "https://api.noopschallenge.com/mazebot/";
