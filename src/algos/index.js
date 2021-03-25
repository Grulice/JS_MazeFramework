export const workers = {
    astar: {
        worker: new Worker(new URL("./scripts/astar.js", import.meta.url)),
        displayName: "A*",
    },
    mrgd: {
        worker: new Worker(new URL("./scripts/mrgd.js", import.meta.url)),
        displayName: "MRGD",
    },
    wave_propagation: {
        worker: new Worker(
            new URL("./scripts/wave_propagation.js", import.meta.url)
        ),
        displayName: "Wave Propagation",
    },
};
