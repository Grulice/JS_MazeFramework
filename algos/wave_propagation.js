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

    let initialMaze = internalizeMaze(mazeInfo);
    let scannedMaze = scanMaze(initialMaze, mazeInfo.start, mazeInfo.end);
  
    console.log(JSON.stringify(scannedMaze));
    let result = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
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

    for (let i = 0; i < walls.length; i++) {
      let c_wall = walls[i];
      maze[c_wall[0]][c_wall[1]] = -1;
    }

    return maze;
  }

  function scanMaze(maze, start, end) {
    debugger
    let nodesInProcess = [end];
    let distance = 1;

    while (nodesInProcess.length > 0) {
      let newlyDiscvNodes = [];
      nodesInProcess.forEach(function(item) {
        newlyDiscvNodes = checkNeighbors(maze, item);
        
        maze[item[0]][item[1]] = distance;
      });


      nodesInProcess = removeDuplcDiscvNodes(newlyDiscvNodes);
      // console.log(JSON.stringify(nodesInProcess));

      distance++;
    }

    return maze;
  }

  function checkNeighbors(maze, node) {
    let discoveredNodes = [];
    let x = node[0];
    let y = node[1];

    if (maze[x - 1][y] == 0) discoveredNodes.push(maze[x-1][y]);
    if (maze[x][y - 1] == 0) discoveredNodes.push(maze[x][y - 1]);
    if (maze[x + 1][y] == 0) discoveredNodes.push(maze[x + 1][y]);
    if (maze[x][y + 1] == 0) discoveredNodes.push(maze[x][y + 1]);
  
    return discoveredNodes;
  }

  function removeDuplcDiscvNodes(nodes) {
    // console.log(nodes);
    let list = [];
    for (let i = 0; i < nodes.length; i++) {
      let curr = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (curr !== nodes[j]) list.push(curr);
      }
    }

    return list;
  }