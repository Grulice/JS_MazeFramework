import { CELL_TYPE_STYLES } from "../consts";
import { ECellType, IMazePosition } from "../types";

export class MazeCell {
    private _type: ECellType;
    public HTMLCell: HTMLTableDataCellElement;
    public readonly position: IMazePosition;

    constructor(
        position: IMazePosition,
        type: ECellType,
        htmlCell: HTMLTableDataCellElement
    ) {
        this._type = type;
        this.position = position;
        this.HTMLCell = htmlCell;
    }

    public set type(newType: ECellType) {
        this._type = newType;
        this.HTMLCell.className = CELL_TYPE_STYLES[newType];
    }

    public get type(): ECellType {
        return this._type;
    }
}
