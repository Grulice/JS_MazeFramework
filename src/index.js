const cellTypes = {
  EMPTY: 0,
  WALL: 1,
  START: 2,
  END: 3,
  PATH: 4,
};

const cellTypeStyles = {
  0: "cell-empty", // empty
  1: "cell-wall", // wall
  2: "cell-start", // start
  3: "cell-end", // end
  4: "cell-path", // path
};

const RANDOM_MAZE_API_BASEURL = "https://api.noopschallenge.com/mazebot/";

HTMLTableCellElement.prototype.cellType = cellTypes.EMPTY;
HTMLTableCellElement.prototype.changeCellTypeTo = function (newType) {
  this.cellType = newType;
  this.className = cellTypeStyles[this.cellType];
};
HTMLTableCellElement.prototype.mazeRow = 0;
HTMLTableCellElement.prototype.mazeCol = 0;

const mainMazeTbl = document.querySelector("#maze-table");
const mazeContainer = document.querySelector(".maze-container");

mainMazeTbl.addEventListener("dragstart", (e) => e.preventDefault());

const dimensionElems = {
  rowInput: document.querySelector("#input-dims-rows"),
  colInput: document.querySelector("#input-dims-cols"),
  goButton: document.querySelector("#draw-maze-button"),
};

const randomMazeElems = {
  minSizeSelect: document.querySelector("#rand-size-select-min"),
  maxSizeSelect: document.querySelector("#rand-size-select-max"),
  goButton: document.querySelector("#rand-get-maze"),
};

const algoSelectElems = {
  algoSelect: document.querySelector("#algo-select"),
  goButton: document.querySelector("#find-path-button"),
};

const pathInfoElems = {
  errorLabel: document.querySelector("#error-label"),
  pathLenCaption: document.querySelector("#path-length"),
  execTimeCaption: document.querySelector("#exec-time"),
};

const loadingPlaque = document.querySelector("#loading-plaque");

// button eventlisteners
dimensionElems.goButton.addEventListener("click", handleCreateMaze);

// Main program
let maze;

handleCreateMaze();
function handleCreateMaze() {
  let rowsNum = Number(dimensionElems.rowInput.value);
  let colsNum = Number(dimensionElems.colInput.value);
  createMaze(rowsNum, colsNum);
}

function createMaze(rowsNum, colsNum) {
  maze = resetMaze();
  removeAllChildren(mainMazeTbl);

  maze.dimensions.rowNumber = rowsNum;
  maze.dimensions.colNumber = colsNum;

  const cellDims = getCellDimensions(colsNum);

  for (let rowNumber = 0; rowNumber < rowsNum; rowNumber++) {
    let curRow = [];
    let htmlRow = mainMazeTbl.insertRow(rowNumber);
    for (let colNumber = 0; colNumber < colsNum; colNumber++) {
      // create an HTML cell
      let curCell = htmlRow.insertCell(colNumber);
      curCell.mazeRow = rowNumber;
      curCell.mazeCol = colNumber;

      curCell.style.height = cellDims + "px";
      curCell.style.width = cellDims + "px";

      addMouseListenersToCell(curCell);
      curRow.push(curCell);
    }
    maze.cells.push(curRow);
  }
}

function resetMaze() {
  return {
    dimensions: {
      rowNumber: 0,
      colNumber: 0,
    },
    cells: [],
    walls: [],
    path: [],
    startCell: null,
    endCell: null,
    drawPath: function (pathArray) {
      this.clearPath();
      for (let step of pathArray) {
        let targetCell = this.cells[step[0]][step[1]];
        if (targetCell.cellType !== cellTypes.WALL) {
          targetCell.changeCellTypeTo(cellTypes.PATH);
          this.path.push(targetCell);
        } else {
          console.error(
            `Can't draw path at ${step[0]}, ${step[1]} because it's a wall.`
          );
        }
      }
    },
    clearPath: function () {
      let shifted = this.path.shift();
      while (shifted) {
        shifted.changeCellTypeTo(cellTypes.EMPTY);
        shifted = this.path.shift();
      }
    },
    drawWall: function (pos) {
      let targetCell = this.cells[pos[0]][pos[1]];
      if (targetCell.cellType === cellTypes.START) {
        this.startCell = null;
      }
      if (targetCell.cellType === cellTypes.END) {
        this.endCell = null;
      }
      targetCell.changeCellTypeTo(cellTypes.WALL);
      this.walls.push([targetCell.mazeRow, targetCell.mazeCol]);
    },
    drawStart: function (pos) {
      let targetCell = this.cells[pos[0]][pos[1]];
      if (this.startCell) {
        this.startCell.changeCellTypeTo(cellTypes.EMPTY);
      }
      if (targetCell !== null) targetCell.changeCellTypeTo(cellTypes.START);
      this.startCell = targetCell;
    },
    drawEnd: function (pos) {
      let targetCell = this.cells[pos[0]][pos[1]];
      if (this.endCell) {
        this.endCell.changeCellTypeTo(cellTypes.EMPTY);
      }
      if (targetCell !== null) targetCell.changeCellTypeTo(cellTypes.END);
      this.endCell = targetCell;
    },
    eraseCell: function (pos) {
      let targetCell = this.cells[pos[0]][pos[1]];
      if (targetCell.cellType !== cellTypes.EMPTY) {
        if (targetCell.cellType === cellTypes.START) {
          this.startCell = null;
        }
        if (targetCell.cellType === cellTypes.END) {
          this.endCell = null;
        }
        targetCell.changeCellTypeTo(cellTypes.EMPTY);
        maze.walls = maze.walls.filter(
          (cell) => !(cell[0] === this.mazeRow && cell[1] === this.mazeCol)
        );
      }
    },
  };
}

function addMouseListenersToCell(htmlCell) {
  // press-drag listeners
  htmlCell.addEventListener("mouseover", function (e) {
    e.preventDefault();
    const curpos = [this.mazeRow, this.mazeCol];
    if (e.buttons === 1) {
      if (e.shiftKey) {
        maze.drawStart(curpos);
      } else if (e.ctrlKey) {
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
    } else if (e.ctrlKey) {
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

function getCellDimensions(colsNum) {
  return (window.innerHeight - 25) / colsNum;
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//#region random maze logic
randomMazeElems.goButton.addEventListener("click", handleRandomMaze);

function handleRandomMaze() {
  let minSize = Number(randomMazeElems.minSizeSelect.value);
  let maxSize = Number(randomMazeElems.maxSizeSelect.value);
  if (maxSize < minSize) maxSize = minSize;

  drawRandomMaze(minSize, maxSize);
}

async function drawRandomMaze(minSize, maxSize) {
  loadingPlaque.classList.remove("invisible");
  let APIresponse = fetch(
    RANDOM_MAZE_API_BASEURL +
      `random?minSize=${minSize.toString()}&maxSize=${maxSize.toString()}`
  );
  let unparsed = await APIresponse;
  let parsed = await unparsed.json();

  let dims = parsed.map.length;
  let startpos = parsed.startingPosition.reverse();
  let endpos = parsed.endingPosition.reverse();
  let mazeMap = parsed.map;

  createMaze(dims, dims);
  maze.drawStart(startpos);
  maze.drawEnd(endpos);

  for (let rowNum = 0; rowNum < mazeMap.length; rowNum++) {
    const row = mazeMap[rowNum];
    for (let colNum = 0; colNum < row.length; colNum++) {
      const cell = row[colNum];
      if (cell === "X") maze.drawWall([rowNum, colNum]);
    }
  }
  loadingPlaque.classList.add("invisible");
}
//#endregion

// pathfinding algorithms connection logic

algoSelectElems.goButton.addEventListener("click", handleFindPath);
let execStartTime = -1;
function handleFindPath() {
  findPathUsingScript(algoSelectElems.algoSelect.value);
}

function findPathUsingScript(fileName) {
  if (!fileName) return;
  let worker = new Worker(`./algos/${fileName}`);

  worker.addEventListener("message", (e) => {
    if (e.data.length > 0) {
      renderPerformanceInfo(e.data.length, Date.now());
      maze.drawPath(e.data);
    } else {
      console.error(`The algorithm didn't return a path`);
    }
    loadingPlaque.classList.add("invisible");
  });

  const startPos = [maze.startCell.mazeRow, maze.startCell.mazeCol];
  const endPos = [maze.endCell.mazeRow, maze.endCell.mazeCol];
  execStartTime = Date.now();
  loadingPlaque.classList.remove("invisible");
  worker.postMessage({
    dimensions: maze.dimensions,
    start: startPos,
    end: endPos,
    walls: maze.walls,
  });
}

function renderPerformanceInfo(pathLength, execFinishTime) {
  pathInfoElems.pathLenCaption.innerText = pathLength.toString();
  pathInfoElems.execTimeCaption.innerText =
    (execFinishTime - execStartTime).toString() + " ms";
}
