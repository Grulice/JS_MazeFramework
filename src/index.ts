import { workers } from "./algos";
import {
    mainMazeTbl,
    dimensionElems,
    algoSelectElems,
    pathInfoElems,
    randomMazeElems,
} from "./elements";
import { Maze } from "./Maze/";
import { hideLoading, showLoading } from "./Maze/utils";
import "./style.css";

workers.forEach((worker) => {
    const { name, displayName } = worker;
    const workerOption = document.createElement("option");
    workerOption.value = name;
    workerOption.innerText = displayName;
    algoSelectElems.algoSelect.append(workerOption);
});

mainMazeTbl.addEventListener("dragstart", (e) => e.preventDefault());
dimensionElems.goButton.addEventListener("click", handleCreateMaze);
algoSelectElems.goButton.addEventListener("click", handleFindPath);
randomMazeElems.goButton.addEventListener("click", handleRandomMaze);

let maze: Maze;

handleCreateMaze();

function handleCreateMaze() {
    let rowsNum = Number(dimensionElems.rowInput.value);
    let colsNum = Number(dimensionElems.colInput.value);
    maze = new Maze(rowsNum, colsNum, mainMazeTbl);
}

function handleRandomMaze() {
    maze.generateRandom();
}

function handleFindPath() {
    showLoading();
    maze.solveUsing(algoSelectElems.algoSelect.value)
        .then((results) => {
            const { pathLength, execTimeMs } = results;
            renderPerformanceInfo(pathLength, execTimeMs);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => hideLoading());
}

function renderPerformanceInfo(pathLength: number, execTime: number) {
    pathInfoElems.pathLenCaption.innerText = pathLength.toString();
    pathInfoElems.execTimeCaption.innerText = execTime.toString() + " ms";
}
