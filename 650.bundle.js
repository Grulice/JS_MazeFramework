(()=>{var __webpack_modules__={650:()=>{eval('/*\n https://github.com/asadovkamran\n*/\n// worker eventlistener. Do not change this.\n//#region\nself.addEventListener("message", function (e) {\n  self.postMessage(solve(e.data));\n}); //#endregion\n// your code goes below this line\n// ----------------------------------------------------------\n\nfunction solve(mazeInfo) {\n  // main solve function\n  // ​\n  // mazeInfo is a JS object and it contains the following info:\n  // dimensions: Object { rowNumber: 278, colNumber: 165 } -- the number of rows and cols\n  // end: Array [ 180, 79 ] -- the coordinates of the end\n  // start: Array [ 142, 79 ] -- the coordinates of the start\n  // walls: [[0,1], [0,2]] -- array of coordinates of the walls\n  // this function must return an array of coordinates of the path (similar to the walls)\n  // Happy pathfinding! :)\n  _ROWS = mazeInfo.dimensions.rowNumber;\n  _COLS = mazeInfo.dimensions.colNumber;\n  _START = mazeInfo.start;\n  _END = mazeInfo.end;\n  _SCANNED_MAZE = [];\n  var initialMaze = internalizeMaze(mazeInfo);\n  _SCANNED_MAZE = scanMaze(initialMaze, mazeInfo.start, mazeInfo.end);\n  console.log(JSON.stringify(_SCANNED_MAZE));\n  var result = buildPath();\n  return result;\n}\n\nfunction internalizeMaze(mazeInfo) {\n  var rows = mazeInfo.dimensions.rowNumber;\n  var cols = mazeInfo.dimensions.colNumber;\n  var walls = mazeInfo.walls;\n  var maze = [];\n\n  for (var i = 0; i < rows; i++) {\n    maze[i] = [];\n\n    for (var j = 0; j < cols; j++) {\n      maze[i][j] = 0;\n    }\n  }\n\n  walls.forEach(function (item) {\n    maze[item[0]][item[1]] = -1;\n  });\n  return maze;\n}\n\nfunction scanMaze(initialMaze, start, end) {\n  var nodesInProcess = [end];\n  var distance = 1;\n  initialMaze[end[0]][end[1]] = distance;\n\n  var _loop = function _loop() {\n    var newlyDiscvNodes = [];\n    nodesInProcess.forEach(function (item) {\n      newlyDiscvNodes = newlyDiscvNodes.concat(checkNeighbors(initialMaze, item));\n    });\n    nodesInProcess = removeDuplcDiscvNodes(newlyDiscvNodes); // console.log(JSON.stringify(nodesInProcess));\n\n    distance++;\n    nodesInProcess.forEach(function (item) {\n      initialMaze[item[0]][item[1]] = distance;\n    });\n  };\n\n  while (nodesInProcess.length > 0) {\n    _loop();\n  }\n\n  return initialMaze;\n}\n\nfunction getNeighborsOf(node) {\n  var x = node[0];\n  var y = node[1];\n  result = [];\n\n  for (var x_offset = -1; x_offset <= 1; x_offset++) {\n    for (var y_offset = -1; y_offset <= 1; y_offset++) {\n      // offset (0, 0) is the cell itself, so ignore it\n      if (x_offset === 0 && y_offset === 0) continue;\n      if (x_offset === 1 && y_offset === 1) continue;\n      if (x_offset === -1 && y_offset === -1) continue;\n      if (x_offset === 1 && y_offset === -1) continue;\n      if (x_offset === -1 && y_offset === 1) continue;\n\n      if (x + x_offset >= 0 && x + x_offset < _ROWS && y + y_offset >= 0 && y + y_offset < _COLS) {\n        result.push([x + x_offset, y + y_offset]);\n      }\n    }\n  }\n\n  return result;\n}\n\nfunction checkNeighbors(initialMaze, node) {\n  var discoveredNodes = [];\n  var x = node[0];\n  var y = node[1];\n\n  for (var x_offset = -1; x_offset <= 1; x_offset++) {\n    for (var y_offset = -1; y_offset <= 1; y_offset++) {\n      // offset (0, 0) is the cell itself, so ignore it\n      if (x_offset === 0 && y_offset === 0) continue;\n      if (x_offset === 1 && y_offset === 1) continue;\n      if (x_offset === -1 && y_offset === -1) continue;\n      if (x_offset === 1 && y_offset === -1) continue;\n      if (x_offset === -1 && y_offset === 1) continue;\n\n      if (x + x_offset >= 0 && x + x_offset < _ROWS && y + y_offset >= 0 && y + y_offset < _COLS) {\n        if (initialMaze[x + x_offset][y + y_offset] === 0) discoveredNodes.push([x + x_offset, y + y_offset]);\n      }\n    }\n  }\n\n  return discoveredNodes;\n}\n\nfunction removeDuplcDiscvNodes(nodes) {\n  // console.log(nodes);\n  var result = [];\n  var obj = {};\n  nodes.forEach(function (item, index) {\n    if (!obj.hasOwnProperty(item.toString())) {\n      obj[item.toString()] = true;\n      result.push(item);\n    }\n  });\n  return result;\n}\n\nfunction buildPath() {\n  // debugger;\n  var end = _END;\n  var start = _START;\n  var currentStep = start;\n  var nodesInProcess = [];\n  var result = [];\n\n  while (currentStep.toString() != end.toString()) {\n    nodesInProcess = getNeighborsOf(currentStep);\n    nodesInProcess.forEach(function (item) {\n      if (getValueAt(item) < getValueAt(currentStep) && getValueAt(item) != -1) {\n        currentStep = item;\n      }\n    });\n    result.push(currentStep);\n  }\n\n  console.log(JSON.stringify(result));\n  return result;\n}\n\nfunction getValueAt(node) {\n  var x = node[0];\n  var y = node[1];\n  return _SCANNED_MAZE[x][y];\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qc19tYXplZnJhbWV3b3JrLy4vc3JjL2FsZ29zL3NjcmlwdHMvd2F2ZV9wcm9wYWdhdGlvbi5qcz9iZjkwIl0sIm5hbWVzIjpbInNlbGYiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInBvc3RNZXNzYWdlIiwic29sdmUiLCJkYXRhIiwibWF6ZUluZm8iLCJfUk9XUyIsImRpbWVuc2lvbnMiLCJyb3dOdW1iZXIiLCJfQ09MUyIsImNvbE51bWJlciIsIl9TVEFSVCIsInN0YXJ0IiwiX0VORCIsImVuZCIsIl9TQ0FOTkVEX01BWkUiLCJpbml0aWFsTWF6ZSIsImludGVybmFsaXplTWF6ZSIsInNjYW5NYXplIiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXN1bHQiLCJidWlsZFBhdGgiLCJyb3dzIiwiY29scyIsIndhbGxzIiwibWF6ZSIsImkiLCJqIiwiZm9yRWFjaCIsIml0ZW0iLCJub2Rlc0luUHJvY2VzcyIsImRpc3RhbmNlIiwibmV3bHlEaXNjdk5vZGVzIiwiY29uY2F0IiwiY2hlY2tOZWlnaGJvcnMiLCJyZW1vdmVEdXBsY0Rpc2N2Tm9kZXMiLCJsZW5ndGgiLCJnZXROZWlnaGJvcnNPZiIsIm5vZGUiLCJ4IiwieSIsInhfb2Zmc2V0IiwieV9vZmZzZXQiLCJwdXNoIiwiZGlzY292ZXJlZE5vZGVzIiwibm9kZXMiLCJvYmoiLCJpbmRleCIsImhhc093blByb3BlcnR5IiwidG9TdHJpbmciLCJjdXJyZW50U3RlcCIsImdldFZhbHVlQXQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQUEsSUFBSSxDQUFDQyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQyxVQUFDQyxDQUFELEVBQU87QUFDcENGLEVBQUFBLElBQUksQ0FBQ0csV0FBTCxDQUFpQkMsS0FBSyxDQUFDRixDQUFDLENBQUNHLElBQUgsQ0FBdEI7QUFDSCxDQUZELEUsQ0FHQTtBQUVBO0FBQ0E7O0FBQ0EsU0FBU0QsS0FBVCxD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O0FBQ25DLFVBQ0lzQixVQUFVLENBQUN0QixJQUFELENBQVYsR0FBbUJzQixVQUFVLENBQUNELFdBQUQsQ0FBN0IsSUFDQUMsVUFBVSxDQUFDdEIsSUFBRCxDQUFWLElBQW9CLENBQUMsQ0FGekIsRUFHRTtBQUNFcUIsUUFBQUEsV0FBVyxHQUFHckIsSUFBZDtBQUNIO0FBQ0osS0FQRDtBQVNBVCxJQUFBQSxNQUFNLENBQUN1QixJQUFQLENBQVlPLFdBQVo7QUFDSDs7QUFFRGxDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUMsTUFBZixDQUFaO0FBRUEsU0FBT0EsTUFBUDtBQUNIOztBQUVELFNBQVMrQixVQUFULENBQW9CYixJQUFwQixFQUEwQjtBQUN0QixNQUFJQyxDQUFDLEdBQUdELElBQUksQ0FBQyxDQUFELENBQVo7QUFDQSxNQUFJRSxDQUFDLEdBQUdGLElBQUksQ0FBQyxDQUFELENBQVo7QUFDQSxTQUFPMUIsYUFBYSxDQUFDMkIsQ0FBRCxDQUFiLENBQWlCQyxDQUFqQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2Fkb3ZrYW1yYW5cbiovXG5cbi8vIHdvcmtlciBldmVudGxpc3RlbmVyLiBEbyBub3QgY2hhbmdlIHRoaXMuXG4vLyNyZWdpb25cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGUpID0+IHtcbiAgICBzZWxmLnBvc3RNZXNzYWdlKHNvbHZlKGUuZGF0YSkpO1xufSk7XG4vLyNlbmRyZWdpb25cblxuLy8geW91ciBjb2RlIGdvZXMgYmVsb3cgdGhpcyBsaW5lXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBzb2x2ZShtYXplSW5mbykge1xuICAgIC8vIG1haW4gc29sdmUgZnVuY3Rpb25cbiAgICAvLyDigItcbiAgICAvLyBtYXplSW5mbyBpcyBhIEpTIG9iamVjdCBhbmQgaXQgY29udGFpbnMgdGhlIGZvbGxvd2luZyBpbmZvOlxuICAgIC8vIGRpbWVuc2lvbnM6IE9iamVjdCB7IHJvd051bWJlcjogMjc4LCBjb2xOdW1iZXI6IDE2NSB9IC0tIHRoZSBudW1iZXIgb2Ygcm93cyBhbmQgY29sc1xuICAgIC8vIGVuZDogQXJyYXkgWyAxODAsIDc5IF0gLS0gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBlbmRcbiAgICAvLyBzdGFydDogQXJyYXkgWyAxNDIsIDc5IF0gLS0gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzdGFydFxuICAgIC8vIHdhbGxzOiBbWzAsMV0sIFswLDJdXSAtLSBhcnJheSBvZiBjb29yZGluYXRlcyBvZiB0aGUgd2FsbHNcblxuICAgIC8vIHRoaXMgZnVuY3Rpb24gbXVzdCByZXR1cm4gYW4gYXJyYXkgb2YgY29vcmRpbmF0ZXMgb2YgdGhlIHBhdGggKHNpbWlsYXIgdG8gdGhlIHdhbGxzKVxuICAgIC8vIEhhcHB5IHBhdGhmaW5kaW5nISA6KVxuICAgIF9ST1dTID0gbWF6ZUluZm8uZGltZW5zaW9ucy5yb3dOdW1iZXI7XG4gICAgX0NPTFMgPSBtYXplSW5mby5kaW1lbnNpb25zLmNvbE51bWJlcjtcbiAgICBfU1RBUlQgPSBtYXplSW5mby5zdGFydDtcbiAgICBfRU5EID0gbWF6ZUluZm8uZW5kO1xuICAgIF9TQ0FOTkVEX01BWkUgPSBbXTtcblxuICAgIGxldCBpbml0aWFsTWF6ZSA9IGludGVybmFsaXplTWF6ZShtYXplSW5mbyk7XG4gICAgX1NDQU5ORURfTUFaRSA9IHNjYW5NYXplKGluaXRpYWxNYXplLCBtYXplSW5mby5zdGFydCwgbWF6ZUluZm8uZW5kKTtcblxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KF9TQ0FOTkVEX01BWkUpKTtcblxuICAgIGxldCByZXN1bHQgPSBidWlsZFBhdGgoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpbnRlcm5hbGl6ZU1hemUobWF6ZUluZm8pIHtcbiAgICBsZXQgcm93cyA9IG1hemVJbmZvLmRpbWVuc2lvbnMucm93TnVtYmVyO1xuICAgIGxldCBjb2xzID0gbWF6ZUluZm8uZGltZW5zaW9ucy5jb2xOdW1iZXI7XG4gICAgbGV0IHdhbGxzID0gbWF6ZUluZm8ud2FsbHM7XG4gICAgbGV0IG1hemUgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSB7XG4gICAgICAgIG1hemVbaV0gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspIHtcbiAgICAgICAgICAgIG1hemVbaV1bal0gPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2FsbHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBtYXplW2l0ZW1bMF1dW2l0ZW1bMV1dID0gLTE7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWF6ZTtcbn1cblxuZnVuY3Rpb24gc2Nhbk1hemUoaW5pdGlhbE1hemUsIHN0YXJ0LCBlbmQpIHtcbiAgICBsZXQgbm9kZXNJblByb2Nlc3MgPSBbZW5kXTtcbiAgICBsZXQgZGlzdGFuY2UgPSAxO1xuICAgIGluaXRpYWxNYXplW2VuZFswXV1bZW5kWzFdXSA9IGRpc3RhbmNlO1xuXG4gICAgd2hpbGUgKG5vZGVzSW5Qcm9jZXNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IG5ld2x5RGlzY3ZOb2RlcyA9IFtdO1xuICAgICAgICBub2Rlc0luUHJvY2Vzcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBuZXdseURpc2N2Tm9kZXMgPSBuZXdseURpc2N2Tm9kZXMuY29uY2F0KFxuICAgICAgICAgICAgICAgIGNoZWNrTmVpZ2hib3JzKGluaXRpYWxNYXplLCBpdGVtKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbm9kZXNJblByb2Nlc3MgPSByZW1vdmVEdXBsY0Rpc2N2Tm9kZXMobmV3bHlEaXNjdk5vZGVzKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShub2Rlc0luUHJvY2VzcykpO1xuXG4gICAgICAgIGRpc3RhbmNlKys7XG5cbiAgICAgICAgbm9kZXNJblByb2Nlc3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaW5pdGlhbE1hemVbaXRlbVswXV1baXRlbVsxXV0gPSBkaXN0YW5jZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluaXRpYWxNYXplO1xufVxuXG5mdW5jdGlvbiBnZXROZWlnaGJvcnNPZihub2RlKSB7XG4gICAgbGV0IHggPSBub2RlWzBdO1xuICAgIGxldCB5ID0gbm9kZVsxXTtcbiAgICByZXN1bHQgPSBbXTtcblxuICAgIGZvciAobGV0IHhfb2Zmc2V0ID0gLTE7IHhfb2Zmc2V0IDw9IDE7IHhfb2Zmc2V0KyspIHtcbiAgICAgICAgZm9yIChsZXQgeV9vZmZzZXQgPSAtMTsgeV9vZmZzZXQgPD0gMTsgeV9vZmZzZXQrKykge1xuICAgICAgICAgICAgLy8gb2Zmc2V0ICgwLCAwKSBpcyB0aGUgY2VsbCBpdHNlbGYsIHNvIGlnbm9yZSBpdFxuICAgICAgICAgICAgaWYgKHhfb2Zmc2V0ID09PSAwICYmIHlfb2Zmc2V0ID09PSAwKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICh4X29mZnNldCA9PT0gMSAmJiB5X29mZnNldCA9PT0gMSkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoeF9vZmZzZXQgPT09IC0xICYmIHlfb2Zmc2V0ID09PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoeF9vZmZzZXQgPT09IDEgJiYgeV9vZmZzZXQgPT09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICh4X29mZnNldCA9PT0gLTEgJiYgeV9vZmZzZXQgPT09IDEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHggKyB4X29mZnNldCA+PSAwICYmXG4gICAgICAgICAgICAgICAgeCArIHhfb2Zmc2V0IDwgX1JPV1MgJiZcbiAgICAgICAgICAgICAgICB5ICsgeV9vZmZzZXQgPj0gMCAmJlxuICAgICAgICAgICAgICAgIHkgKyB5X29mZnNldCA8IF9DT0xTXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChbeCArIHhfb2Zmc2V0LCB5ICsgeV9vZmZzZXRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTmVpZ2hib3JzKGluaXRpYWxNYXplLCBub2RlKSB7XG4gICAgbGV0IGRpc2NvdmVyZWROb2RlcyA9IFtdO1xuICAgIGxldCB4ID0gbm9kZVswXTtcbiAgICBsZXQgeSA9IG5vZGVbMV07XG5cbiAgICBmb3IgKGxldCB4X29mZnNldCA9IC0xOyB4X29mZnNldCA8PSAxOyB4X29mZnNldCsrKSB7XG4gICAgICAgIGZvciAobGV0IHlfb2Zmc2V0ID0gLTE7IHlfb2Zmc2V0IDw9IDE7IHlfb2Zmc2V0KyspIHtcbiAgICAgICAgICAgIC8vIG9mZnNldCAoMCwgMCkgaXMgdGhlIGNlbGwgaXRzZWxmLCBzbyBpZ25vcmUgaXRcbiAgICAgICAgICAgIGlmICh4X29mZnNldCA9PT0gMCAmJiB5X29mZnNldCA9PT0gMCkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoeF9vZmZzZXQgPT09IDEgJiYgeV9vZmZzZXQgPT09IDEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHhfb2Zmc2V0ID09PSAtMSAmJiB5X29mZnNldCA9PT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHhfb2Zmc2V0ID09PSAxICYmIHlfb2Zmc2V0ID09PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoeF9vZmZzZXQgPT09IC0xICYmIHlfb2Zmc2V0ID09PSAxKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB4ICsgeF9vZmZzZXQgPj0gMCAmJlxuICAgICAgICAgICAgICAgIHggKyB4X29mZnNldCA8IF9ST1dTICYmXG4gICAgICAgICAgICAgICAgeSArIHlfb2Zmc2V0ID49IDAgJiZcbiAgICAgICAgICAgICAgICB5ICsgeV9vZmZzZXQgPCBfQ09MU1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxNYXplW3ggKyB4X29mZnNldF1beSArIHlfb2Zmc2V0XSA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgZGlzY292ZXJlZE5vZGVzLnB1c2goW3ggKyB4X29mZnNldCwgeSArIHlfb2Zmc2V0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGlzY292ZXJlZE5vZGVzO1xufVxuXG5mdW5jdGlvbiByZW1vdmVEdXBsY0Rpc2N2Tm9kZXMobm9kZXMpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhub2Rlcyk7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShpdGVtLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICBvYmpbaXRlbS50b1N0cmluZygpXSA9IHRydWU7XG4gICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYnVpbGRQYXRoKCkge1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIGxldCBlbmQgPSBfRU5EO1xuICAgIGxldCBzdGFydCA9IF9TVEFSVDtcbiAgICBsZXQgY3VycmVudFN0ZXAgPSBzdGFydDtcbiAgICBsZXQgbm9kZXNJblByb2Nlc3MgPSBbXTtcbiAgICBsZXQgcmVzdWx0ID0gW107XG5cbiAgICB3aGlsZSAoY3VycmVudFN0ZXAudG9TdHJpbmcoKSAhPSBlbmQudG9TdHJpbmcoKSkge1xuICAgICAgICBub2Rlc0luUHJvY2VzcyA9IGdldE5laWdoYm9yc09mKGN1cnJlbnRTdGVwKTtcbiAgICAgICAgbm9kZXNJblByb2Nlc3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGdldFZhbHVlQXQoaXRlbSkgPCBnZXRWYWx1ZUF0KGN1cnJlbnRTdGVwKSAmJlxuICAgICAgICAgICAgICAgIGdldFZhbHVlQXQoaXRlbSkgIT0gLTFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGVwID0gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0LnB1c2goY3VycmVudFN0ZXApO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVBdChub2RlKSB7XG4gICAgbGV0IHggPSBub2RlWzBdO1xuICAgIGxldCB5ID0gbm9kZVsxXTtcbiAgICByZXR1cm4gX1NDQU5ORURfTUFaRVt4XVt5XTtcbn1cbiJdLCJmaWxlIjoiNjUwLmpzIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///650\n')}},__webpack_exports__={};__webpack_modules__[650]()})();