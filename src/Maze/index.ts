import { getCellDimensions, removeAllChildren } from "./utils";
import { MazeCell } from "./MazeCell";
import { ECellType, IBenchmarkResults, IMazeInfo, TPosition } from "../types";
import { workers } from "../algos";
import random from "lodash/random";

export class Maze {
    public readonly rows: number;
    public readonly cols: number;

    private map: MazeCell[][] = [];
    private startCell: MazeCell;
    private endCell: MazeCell;
    private walls: MazeCell[] = [];
    private path: MazeCell[] = [];
    private htmlTable: HTMLTableElement;

    constructor(rows: number, cols: number, htmlTable: HTMLTableElement) {
        this.rows = rows;
        this.cols = cols;
        this.htmlTable = htmlTable;
        this.reset();
    }

    public reset() {
        const { cols, rows, htmlTable } = this;
        removeAllChildren(this.htmlTable);
        const cellDims = getCellDimensions(cols);

        for (let row = 0; row < rows; row++) {
            let curRow: MazeCell[] = [];
            let htmlRow = htmlTable.insertRow(row);
            for (let col = 0; col < cols; col++) {
                let curCell = new MazeCell(
                    { row, col },
                    ECellType.EMPTY,
                    htmlRow.insertCell(col)
                );

                curCell.HTMLCell.style.height = cellDims + "px";
                curCell.HTMLCell.style.width = cellDims + "px";

                this.addMouseListenersToCell(curCell);
                curRow.push(curCell);
            }
            this.map.push(curRow);
        }
    }

    public solveUsing(algoName: string): Promise<IBenchmarkResults> {
        let execStartTime = Date.now();
        return new Promise((resolve, reject) => {
            if (!algoName) return reject("Invalid algorithm name");
            let worker = workers.find((wrk) => wrk.name === algoName).worker;

            const workerHandler = (e: MessageEvent<Array<TPosition>>) => {
                const pathLength = e.data.length;
                if (pathLength > 0) {
                    resolve({
                        pathLength,
                        execTimeMs: Date.now() - execStartTime,
                    });
                    this.drawPath(e.data);
                    worker.removeEventListener("message", workerHandler);
                } else {
                    reject("The algorithm didn't return a path");
                }
            };
            worker.addEventListener("message", workerHandler);

            const mazeInfo: IMazeInfo = {
                dimensions: { rowNumber: this.rows, colNumber: this.cols },
                start: [
                    this.startCell.position.row,
                    this.startCell.position.col,
                ],
                end: [this.endCell.position.row, this.endCell.position.col],
                walls: this.walls.map((wallCell) => [
                    wallCell.position.row,
                    wallCell.position.col,
                ]),
            };
            worker.postMessage(mazeInfo);
        });
    }

    public generateRandom() {
        this.map.forEach((row) =>
            row.forEach((cell) => {
                this.eraseCell(cell);
                if (random(0, 2) === 0) {
                    this.setWall(cell);
                }
            })
        );
    }

    private addMouseListenersToCell(cell: MazeCell) {
        // press-drag listeners
        const { setStart, setEnd, setWall, eraseCell } = this;
        cell.HTMLCell.addEventListener("mouseover", function (e) {
            e.preventDefault();
            if (e.buttons === 1) {
                if (e.shiftKey) {
                    setStart(cell);
                } else if (e.ctrlKey || e.metaKey) {
                    setEnd(cell);
                } else {
                    setWall(cell);
                }
            } else if (e.buttons === 2) {
                eraseCell(cell);
            }
        });

        // For some reason, single clicks over cells are not handled by events above,
        // so we have to write them out separately
        cell.HTMLCell.addEventListener("click", function (e) {
            e.preventDefault();
            if (e.shiftKey) {
                setStart(cell);
            } else if (e.ctrlKey || e.metaKey) {
                setEnd(cell);
            } else {
                setWall(cell);
            }
        });
        cell.HTMLCell.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            eraseCell(cell);
        });
    }

    private setStart = (cell: MazeCell) => {
        if (this.startCell) {
            this.startCell.type = ECellType.EMPTY;
        }
        cell.type = ECellType.START;
        this.startCell = cell;
    };

    private setEnd = (cell: MazeCell) => {
        if (this.endCell) {
            this.endCell.type = ECellType.EMPTY;
        }
        cell.type = ECellType.END;
        this.endCell = cell;
    };

    private setWall = (cell: MazeCell): void => {
        if (cell.type === ECellType.START) {
            this.startCell = null;
        }
        if (cell.type === ECellType.END) {
            this.endCell = null;
        }
        cell.type = ECellType.WALL;
        this.walls.push(cell);
    };

    private eraseCell = (cell: MazeCell) => {
        if (cell.type === ECellType.EMPTY) return;

        if (cell.type === ECellType.START) {
            this.startCell = null;
        }
        if (cell.type === ECellType.END) {
            this.endCell = null;
        }
        cell.type = ECellType.EMPTY;
        this.walls = this.walls.filter(
            (wallCell) =>
                !(
                    wallCell.position.row === cell.position.row &&
                    wallCell.position.col === cell.position.col
                )
        );
    };

    private drawPath = (pathArray: Array<TPosition>) => {
        this.clearPath();
        for (let [row, col] of pathArray) {
            let targetCell = this.map[row][col];
            if (targetCell.type === ECellType.EMPTY) {
                targetCell.type = ECellType.PATH;
                this.path.push(targetCell);
            } else {
                console.warn(
                    `Skipped drawing a path at ${row}, ${col} because it's of type ${
                        ECellType[targetCell.type]
                    }.`
                );
            }
        }
    };

    private clearPath = () => {
        let shifted = this.path.shift();

        while (shifted) {
            if (shifted.type === ECellType.PATH) {
                shifted.type = ECellType.EMPTY;
            }
            shifted = this.path.shift();
        }
    };
}
