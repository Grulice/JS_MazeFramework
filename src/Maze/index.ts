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

    public softReset() {
        [...this.walls, ...this.path].forEach((cell) => {
            cell.type = ECellType.EMPTY;
        });
        this.walls = [];
        this.path = [];
        this.eraseCell(this.startCell);
        this.eraseCell(this.endCell);
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
        this.softReset();
        for (let i = 0; i < Math.round((this.rows * this.cols) / 3); i++) {
            const randRow = random(this.rows - 1);
            const randCol = random(this.cols - 1);
            const target = this.map[randRow][randCol];
            this.setWall(target);
        }
    }

    private addMouseListenersToCell(cell: MazeCell) {
        cell.HTMLCell.addEventListener("mouseenter", (e) => {
            e.preventDefault();
            if (e.buttons === 1) {
                if (e.shiftKey) {
                    this.setStart(cell);
                } else if (e.ctrlKey || e.metaKey) {
                    this.setEnd(cell);
                } else {
                    this.handleDrawLine(cell, ECellType.WALL);
                }
            } else if (e.buttons === 2) {
                this.handleDrawLine(cell, ECellType.EMPTY);
            }
        });

        // For some reason, single clicks over cells are not handled by events above,
        // so we have to write them out separately
        cell.HTMLCell.addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (e.shiftKey) {
                this.setStart(cell);
            } else if (e.ctrlKey || e.metaKey) {
                this.setEnd(cell);
            } else {
                this.setWall(cell);
            }
        });
        cell.HTMLCell.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.eraseCell(cell);
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

    private drawingPoints: TPosition[] = [];
    private handleDrawLine = (cell: MazeCell, type: ECellType) => {
        const curPoint: TPosition = [cell.position.row, cell.position.col];
        this.drawingPoints.push(curPoint);
        if (this.drawingPoints.length > 1) {
            const a = this.drawingPoints.shift();
            const b = this.drawingPoints[0];
            this.drawLine(a, b, type);
        }
    };

    public resetDrawingPoints = () => {
        this.drawingPoints = [];
    };

    /**
     * Interpolates and draws a line of cells between two points on the grid
     * @param a starting point position
     * @param b ending point position
     * @param cellType the cell type that the line will be painted with
     */
    private drawLine = (a: TPosition, b: TPosition, cellType: ECellType) => {
        const { max, abs, round } = Math;
        const offsetRow = b[0] - a[0];
        const offsetCol = b[1] - a[1];

        const delta = max(abs(offsetRow), abs(offsetCol));
        const deltaRow = offsetRow / delta;
        const deltaCol = offsetCol / delta;

        let curRow = a[0];
        let curCol = a[1];
        let roundedRow = round(curRow);
        let roundedCol = round(curCol);
        do {
            this.setCell(this.map[roundedRow][roundedCol], cellType);
            curRow += deltaRow;
            curCol += deltaCol;
            roundedRow = round(curRow);
            roundedCol = round(curCol);
        } while (roundedRow !== b[0] || roundedCol !== b[1]);

        this.setCell(this.map[b[0]][b[1]], cellType);
    };

    private setCell = (cell: MazeCell, type: ECellType) => {
        switch (type) {
            case ECellType.WALL:
                this.setWall(cell);
                break;
            case ECellType.EMPTY:
                this.eraseCell(cell);
                break;
            case ECellType.START:
                this.setStart(cell);
                break;
            case ECellType.END:
                this.setEnd(cell);
                break;
            default:
                break;
        }
    };
}
