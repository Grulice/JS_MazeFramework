// worker eventlistener. Do not change this.
//#region
self.addEventListener("message", (e) => {
    self.postMessage(solve(e.data));
    self.close();
});
//#endregion

// your code goes below this line
// ----------------------------------------------------------
// Author: Javid Bunyadzade (https://github.com/Grulice)

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

    return solveAStar(mazeInfo);
}

const nodeTypes = {
    EMPTY: 0,
    WALL: 1,
    START: 2,
    END: 3,
};

function solveAStar(mazeInfo) {
    let graph = initiateGraph(mazeInfo);

    // initialize the notTested list
    graph.startNode.localScore = 0;
    graph.startNode.globalScore = heuristic(graph.startNode, graph.endNode);
    let notTested = [graph.startNode];
    let currentNode = graph.startNode;

    // continue while there are unexplored nodes OR we've hit the end
    // this does not guarantee the shortest path, but it's a performance improvement
    // and you'll most likely be on the shortest path. If you want to explore all
    // nodes and 100% get the shortest path - remove the currentNode != graph.endNode condition
    while (notTested.length > 0 && currentNode != graph.endNode) {
        // sort the array by the global heuristic (check nodes that are physically
        // closer to the end first)
        notTested.sort((nodeA, nodeB) => nodeA.globalScore > nodeB.globalScore);

        // shift the notTested and test that node. We won't visit a node
        // more than once
        currentNode = notTested.shift();
        currentNode.visited = true;

        for (let neighbor of getNodeNeighbors(currentNode, graph)) {
            // only add the neighbor node if it hasn't been visited, it's not a wall
            // or if it is not already in the list
            if (
                !neighbor.visited &&
                neighbor.type !== nodeTypes.WALL &&
                !notTested.includes(neighbor)
            ) {
                notTested.push(neighbor);
            }

            // calculate the potential local score. The actual algo
            // should compute the edge's weight between 2 nodes, but we can optimize
            // because our graph is a grid and all edge weights are 1
            curLocalScore = currentNode.localScore + 1;
            if (neighbor.localScore > curLocalScore) {
                // update the neighbor if the current computed local score is lower
                // than the neighbors own local score
                neighbor.parent = currentNode;
                neighbor.localScore = curLocalScore;
                // the global score is calculated from how difficult it is to get to this cell so far PLUS
                // the direct distance to the end, so that there's bias towards the nodes that are physically closer
                // to the end
                neighbor.globalScore =
                    curLocalScore + heuristic(neighbor, graph.endNode);
            }
        }
    }

    // backtrack starting from the end
    currentNode = graph.endNode;
    let finalPath = [];
    while (currentNode.parent) {
        finalPath.push([currentNode.row, currentNode.col]);
        currentNode = currentNode.parent;
    }
    return finalPath;
}

function initiateGraph(mazeInfo) {
    let resultGraph = [];
    const rowsN = mazeInfo.dimensions.rowNumber;
    const colsN = mazeInfo.dimensions.colNumber;
    let startNode = null,
        endNode = null;
    for (let curRowNum = 0; curRowNum < rowsN; curRowNum++) {
        let curRow = [];
        for (let curColNum = 0; curColNum < colsN; curColNum++) {
            let newNode = createNode(curRowNum, curColNum);

            if (
                curRowNum === mazeInfo.start[0] &&
                curColNum === mazeInfo.start[1]
            ) {
                newNode.type = nodeTypes.START;
                startNode = newNode;
            } else if (
                curRowNum === mazeInfo.end[0] &&
                curColNum === mazeInfo.end[1]
            ) {
                newNode.type = nodeTypes.END;
                endNode = newNode;
            } else if (
                mazeInfo.walls.find(
                    (wall) => wall[0] === curRowNum && wall[1] === curColNum
                )
            ) {
                newNode.type = nodeTypes.WALL;
            } else {
                newNode.type = nodeTypes.EMPTY;
            }

            curRow.push(newNode);
        }
        resultGraph.push(curRow);
    }

    return { nodes: resultGraph, startNode: startNode, endNode: endNode };
}

function createNode(rowNum, colNum) {
    return {
        type: nodeTypes.EMPTY,
        visited: false,
        globalScore: Number.POSITIVE_INFINITY,
        localScore: Number.POSITIVE_INFINITY,
        row: rowNum,
        col: colNum,
        parent: null,
    };
}

function heuristic(nodeA, nodeB) {
    return distance(nodeA, nodeB);
}

function distance(nodeA, nodeB) {
    // find distance using Pythagoras' theorem
    let sideA = nodeA.row - nodeB.row + 1;
    let sideB = nodeA.col - nodeB.col + 1;
    return Math.sqrt(sideA ** 2 + sideB ** 2);
}

function getNodeNeighbors(node, graph) {
    let neighbors = [];
    let offsets = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    for (let offset of offsets) {
        let targetCoordRow = node.row + offset[0];
        let targetCoordCol = node.col + offset[1];
        if (
            targetCoordRow >= 0 &&
            targetCoordRow < graph.nodes.length &&
            targetCoordCol >= 0 &&
            targetCoordCol < graph.nodes[0].length
        ) {
            neighbors.push(graph.nodes[targetCoordRow][targetCoordCol]);
        }
    }

    return neighbors;
}
