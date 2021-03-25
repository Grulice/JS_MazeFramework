import { IMazeAlgorithm } from "../types";

export const workers: IMazeAlgorithm[] = [
    {
        name: "astar",
        worker: new Worker(new URL("./scripts/astar.js", import.meta.url)),
        displayName: "A*",
    },
    {
        name: "mrgd",
        worker: new Worker(new URL("./scripts/mrgd.js", import.meta.url)),
        displayName: "MRGD",
    },
    {
        name: "wave_propagation",
        worker: new Worker(
            new URL("./scripts/wave_propagation.js", import.meta.url)
        ),
        displayName: "Wave Propagation",
    },
];
