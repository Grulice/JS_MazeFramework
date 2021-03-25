/*
 https://github.com/asadovkamran
*/

// worker eventlistener. Do not change this.
//#region
self.addEventListener("message", (e) => {
    self.postMessage(solve(e.data));
    self.close();
});
//#endregion

// your code goes below this line
// ----------------------------------------------------------
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
    _ROWS = mazeInfo.dimensions.rowNumber;
    _COLS = mazeInfo.dimensions.colNumber;
    _START = mazeInfo.start;
    _END = mazeInfo.end;
    _SCANNED_MAZE = [];

    let initialMaze = internalizeMaze(mazeInfo);
    _SCANNED_MAZE = scanMaze(initialMaze, mazeInfo.start, mazeInfo.end);

    console.log(JSON.stringify(_SCANNED_MAZE));

    let result = buildPath();
    return result;
}

function internalizeMaze(mazeInfo) {
    let rows = mazeInfo.dimensions.rowNumber;
    let cols = mazeInfo.dimensions.colNumber;
    let walls = mazeInfo.walls;
    let maze = [];

    for (let i = 0; i < rows; i++) {
        maze[i] = [];
        for (let j = 0; j < cols; j++) {
            maze[i][j] = 0;
        }
    }

    walls.forEach(function (item) {
        maze[item[0]][item[1]] = -1;
    });

    return maze;
}

function scanMaze(initialMaze, start, end) {
    let nodesInProcess = [end];
    let distance = 1;
    initialMaze[end[0]][end[1]] = distance;

    while (nodesInProcess.length > 0) {
        let newlyDiscvNodes = [];
        nodesInProcess.forEach(function (item) {
            newlyDiscvNodes = newlyDiscvNodes.concat(
                checkNeighbors(initialMaze, item)
            );
        });

        nodesInProcess = removeDuplcDiscvNodes(newlyDiscvNodes);

        // console.log(JSON.stringify(nodesInProcess));

        distance++;

        nodesInProcess.forEach(function (item) {
            initialMaze[item[0]][item[1]] = distance;
        });
    }

    return initialMaze;
}

function getNeighborsOf(node) {
    let x = node[0];
    let y = node[1];
    result = [];

    for (let x_offset = -1; x_offset <= 1; x_offset++) {
        for (let y_offset = -1; y_offset <= 1; y_offset++) {
            // offset (0, 0) is the cell itself, so ignore it
            if (x_offset === 0 && y_offset === 0) continue;
            if (x_offset === 1 && y_offset === 1) continue;
            if (x_offset === -1 && y_offset === -1) continue;
            if (x_offset === 1 && y_offset === -1) continue;
            if (x_offset === -1 && y_offset === 1) continue;
            if (
                x + x_offset >= 0 &&
                x + x_offset < _ROWS &&
                y + y_offset >= 0 &&
                y + y_offset < _COLS
            ) {
                result.push([x + x_offset, y + y_offset]);
            }
        }
    }

    return result;
}

function checkNeighbors(initialMaze, node) {
    let discoveredNodes = [];
    let x = node[0];
    let y = node[1];

    for (let x_offset = -1; x_offset <= 1; x_offset++) {
        for (let y_offset = -1; y_offset <= 1; y_offset++) {
            // offset (0, 0) is the cell itself, so ignore it
            if (x_offset === 0 && y_offset === 0) continue;
            if (x_offset === 1 && y_offset === 1) continue;
            if (x_offset === -1 && y_offset === -1) continue;
            if (x_offset === 1 && y_offset === -1) continue;
            if (x_offset === -1 && y_offset === 1) continue;
            if (
                x + x_offset >= 0 &&
                x + x_offset < _ROWS &&
                y + y_offset >= 0 &&
                y + y_offset < _COLS
            ) {
                if (initialMaze[x + x_offset][y + y_offset] === 0)
                    discoveredNodes.push([x + x_offset, y + y_offset]);
            }
        }
    }

    return discoveredNodes;
}

function removeDuplcDiscvNodes(nodes) {
    // console.log(nodes);
    let result = [];
    let obj = {};
    nodes.forEach(function (item, index) {
        if (!obj.hasOwnProperty(item.toString())) {
            obj[item.toString()] = true;
            result.push(item);
        }
    });

    return result;
}

function buildPath() {
    // debugger;
    let end = _END;
    let start = _START;
    let currentStep = start;
    let nodesInProcess = [];
    let result = [];

    while (currentStep.toString() != end.toString()) {
        nodesInProcess = getNeighborsOf(currentStep);
        nodesInProcess.forEach(function (item) {
            if (
                getValueAt(item) < getValueAt(currentStep) &&
                getValueAt(item) != -1
            ) {
                currentStep = item;
            }
        });

        result.push(currentStep);
    }

    console.log(JSON.stringify(result));

    return result;
}

function getValueAt(node) {
    let x = node[0];
    let y = node[1];
    return _SCANNED_MAZE[x][y];
}
