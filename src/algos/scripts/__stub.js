// worker eventlistener. Do not change this.
//#region
self.addEventListener("message", (e) => {
    self.postMessage(solve(e.data));
});
//#endregion

// your code goes below this line
// ----------------------------------------------------------
/**
 *
 * @param {Object} mazeInfo JS object containing info about the maze
 * @param {{rowNumber: number, colNumber: number}} mazeInfo.dimensions Number of rows and cols
 * @param {[number, number]} mazeInfo.end The coordinates of the end (e.g. `[ 180, 79 ]`)
 * @param {[number, number]} mazeInfo.start The coordinates of the start (e.g. `[ 180, 79 ]`)
 * @param {[number, number][]} mazeInfo.walls Array of coordinates of the walls(e.g. `[[ 180, 79 ], [ 181, 79 ]]`)
 * @returns {[number, number][]} Array of coordinates of the path (similar to the walls)
 */
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

    console.log(mazeInfo);
    let result = [
        [0, 0],
        [0, 1],
        [0, 2],
    ];
    return result;
}
