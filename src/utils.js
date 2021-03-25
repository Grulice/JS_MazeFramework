export function addMouseListenersToCell(htmlCell, maze) {
    // press-drag listeners
    htmlCell.addEventListener("mouseover", function (e) {
        e.preventDefault();
        const curpos = [this.mazeRow, this.mazeCol];
        if (e.buttons === 1) {
            if (e.shiftKey) {
                maze.drawStart(curpos);
            } else if (e.ctrlKey || e.metaKey) {
                maze.drawEnd(curpos);
            } else {
                maze.drawWall(curpos);
            }
        } else if (e.buttons === 2) {
            maze.eraseCell(curpos);
        }
    });

    // For some reason, single clicks over cells are not handled by events above,
    // so we have to write them out separately
    htmlCell.addEventListener("click", function (e) {
        e.preventDefault();
        const curpos = [this.mazeRow, this.mazeCol];
        if (e.shiftKey) {
            maze.drawStart(curpos);
        } else if (e.ctrlKey || e.metaKey) {
            maze.drawEnd(curpos);
        } else {
            maze.drawWall(curpos);
        }
    });
    htmlCell.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        const curpos = [this.mazeRow, this.mazeCol];
        maze.eraseCell(curpos);
    });
}

export function getCellDimensions(colsNum) {
    return (window.innerHeight - 25) / colsNum;
}

export function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}