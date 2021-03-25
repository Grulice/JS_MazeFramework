const mainMazeTbl = document.querySelector<HTMLTableElement>("#maze-table");

const dimensionElems = {
    rowInput: document.querySelector<HTMLInputElement>("#input-dims-rows"),
    colInput: document.querySelector<HTMLInputElement>("#input-dims-cols"),
    goButton: document.querySelector<HTMLButtonElement>("#draw-maze-button"),
};

const randomMazeElems = {
    minSizeSelect: document.querySelector<HTMLSelectElement>(
        "#rand-size-select-min"
    ),
    maxSizeSelect: document.querySelector<HTMLSelectElement>(
        "#rand-size-select-max"
    ),
    goButton: document.querySelector<HTMLButtonElement>("#rand-get-maze"),
};

const algoSelectElems = {
    algoSelect: document.querySelector<HTMLSelectElement>("#algo-select"),
    goButton: document.querySelector<HTMLButtonElement>("#find-path-button"),
};

const pathInfoElems = {
    errorLabel: document.querySelector<HTMLParagraphElement>("#error-label"),
    pathLenCaption: document.querySelector<HTMLParagraphElement>(
        "#path-length"
    ),
    execTimeCaption: document.querySelector<HTMLParagraphElement>("#exec-time"),
};

const loadingPlaque = document.querySelector<HTMLDivElement>("#loading-plaque");

export {
    mainMazeTbl,
    dimensionElems,
    randomMazeElems,
    algoSelectElems,
    pathInfoElems,
    loadingPlaque,
};
