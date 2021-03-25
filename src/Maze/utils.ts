import { loadingPlaque } from "../elements";

export function getCellDimensions(colsNum: number) {
    return (window.innerHeight - 25) / colsNum;
}

export function removeAllChildren(element: HTMLElement) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function showLoading() {
    loadingPlaque.classList.remove("invisible");
}

export function hideLoading() {
    loadingPlaque.classList.add("invisible");
}
