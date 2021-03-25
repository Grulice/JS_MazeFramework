export enum ECellType {
    EMPTY,
    WALL,
    START,
    END,
    PATH,
}

export interface IMazePosition {
    row: number;
    col: number;
}

export interface IMazeAlgorithm {
    /** Name to be used internally */
    name: string;

    /** WebWorker for the algorithm. */
    worker: Worker;

    /** Name to be displayed in the select */
    displayName: string;
}

export interface IBenchmarkResults {
    pathLength: number;
    execTimeMs: number;
}

export type TPosition = [row: number, col: number];

export interface IMazeDimensions {
    rowNumber: number;
    colNumber: number;
}

export interface IMazeInfo {
    /** The number of rows and cols */
    dimensions: IMazeDimensions;

    /** A [number, number] tuple containing coordinates of the start */
    start: TPosition;

    /** A [number, number] tuple containing coordinates of the end */
    end: TPosition;

    /** Array of coordinates of the walls */
    walls: Array<TPosition>;
}
