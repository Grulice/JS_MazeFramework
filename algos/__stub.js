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

    console.log(mazeInfo);
    let result = [
        [0, 0],
        [0, 1],
        [0, 2],
    ];
    return result;
}
