// worker eventlistener. Do not change this.
//#region
self.addEventListener("message", (e) => {
    self.postMessage(solve(e.data));
    self.close();
});
//#endregion

// your code goes below this line
// ----------------------------------------------------------
// Author: Aleksandr Kozlov (https://github.com/mr9d/)

function createMaze(mazeInfo) {
    let maze = new Array(mazeInfo.dimensions.rowNumber).fill([]);
    maze = maze.map((_) => new Array(mazeInfo.dimensions.colNumber).fill(" "));

    maze[mazeInfo.start[0]][mazeInfo.start[1]] = "s";
    maze[mazeInfo.end[0]][mazeInfo.end[1]] = "e";
    mazeInfo.walls.forEach(([row, col]) => (maze[row][col] = "#"));

    return maze;
}

function cloneMaze(maze) {
    const newMaze = [];
    maze.forEach((row) => {
        newMaze.push([...row]);
    });
    return newMaze;
}

function consoleMaze(maze) {
    for (let row = 0; row < maze.length; row++) {
        console.log(maze[row].join(""));
    }
}

function checkRowCol(row, col, mazeInfo) {
    return (
        row >= 0 &&
        col >= 0 &&
        row < mazeInfo.dimensions.rowNumber &&
        col < mazeInfo.dimensions.colNumber
    );
}

function getNearCells(row, col, mazeInfo) {
    return [
        [row + 1, col],
        [row - 1, col],
        [row, col + 1],
        [row, col - 1],
    ].filter(([r, c]) => checkRowCol(r, c, mazeInfo));
}

function hasWeight(row, col, maze) {
    return maze[row][col] === "e" || +maze[row][col] > 0;
}

function getWeight(row, col, maze) {
    if (maze[row][col] === "e") {
        return 0;
    }
    if (+maze[row][col] > 0) {
        return +maze[row][col];
    }
    return null;
}

function solve(mazeInfo) {
    // main solve function
    // ​
    // mazeInfo is a JS object and it contains the following info:
    // dimensions: Object { rowNumber: 278, colNumber: 165 } -- the number of rows and cols
    // end: Array [ 180, 79 ] -- the coordinates of the end
    // start: Array [ 142, 79 ] -- the coordinates of the start
    // walls: [[0,1], [0,2]] -- array of coordinates of the walls

    // this function must return an array of coordinates of the path (similar to the walls)
    // Happy pathfinding! :)

    // console.log(mazeInfo);
    // console.log(mazeInfo.dimensions);
    // console.log("start", mazeInfo.start);
    // console.log("end", mazeInfo.end);
    // console.log(mazeInfo.walls);

    let maze = createMaze(mazeInfo);

    // calculating weights
    let finished = false;
    while (!finished) {
        const nextStepMaze = cloneMaze(maze);
        let cellUpdateCount = 0;

        for (let row = 0; row < mazeInfo.dimensions.rowNumber; row++) {
            for (let col = 0; col < mazeInfo.dimensions.colNumber; col++) {
                if (maze[row][col] === " ") {
                    const nearCells = getNearCells(row, col, mazeInfo);
                    const withWeight = nearCells.filter(([r, c]) =>
                        hasWeight(r, c, maze)
                    );
                    if (withWeight.length > 0) {
                        const maxWeight = withWeight
                            .map(([r, c]) => getWeight(r, c, maze))
                            .reduce((a, b) => Math.max(a, b));
                        nextStepMaze[row][col] = maxWeight + 1;
                        cellUpdateCount++;
                    }
                }
            }
        }

        maze = nextStepMaze;
        finished = cellUpdateCount === 0;
    }

    // looking for path based on weights
    let path = [];
    let coord = mazeInfo.start;
    while (coord[0] !== mazeInfo.end[0] || coord[1] !== mazeInfo.end[1]) {
        path.push(coord);
        const nearCells = getNearCells(coord[0], coord[1], mazeInfo);
        const withWeight = nearCells.filter(([r, c]) => hasWeight(r, c, maze));
        if (withWeight.length === 0) {
            // throw error?
            break;
        }
        const cellWithMinWeight = withWeight.reduce((a, b) =>
            getWeight(a[0], a[1], maze) > getWeight(b[0], b[1], maze) ? b : a
        );
        coord = cellWithMinWeight;
    }
    path.push(coord);

    //consoleMaze(maze);
    //console.log(path);

    return path;
}
