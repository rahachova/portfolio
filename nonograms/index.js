const easyGame = {
  heart: [
    [
      { value: 0, selected: false },
      { value: 1, selected: false },
      { value: 0, selected: false },
      { value: 1, selected: false },
      { value: 0, selected: false },
    ],
    [
      { value: 1, selected: false },
      { value: 1, selected: false },
      { value: 1, selected: false },
      { value: 1, selected: false },
      { value: 1, selected: false },
    ],
    [
      { value: 0, selected: false },
      { value: 1, selected: false },
      { value: 1, selected: false },
      { value: 1, selected: false },
      { value: 0, selected: false },
    ],
    [
      { value: 0, selected: false },
      { value: 0, selected: false },
      { value: 1, selected: false },
      { value: 0, selected: false },
      { value: 0, selected: false },
    ],
    [
      { value: 0, selected: false },
      { value: 0, selected: false },
      { value: 0, selected: false },
      { value: 0, selected: false },
      { value: 0, selected: false },
    ],
  ],
  crown: [
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ],
};

const main = document.querySelector("main");
let currentCells;
let currentCellsData;

function createPlayField(matrix) {
  const playField = document.createElement("h2");
  playField.classList.add("play-field");
  const gameName = document.createElement("h1");
  gameName.textContent = "Nonograms";
  const cellContainer = document.createElement("div");
  cellContainer.classList.add("cell-container");
  currentCells = createCells(matrix);
  cellContainer.append(...currentCells);
  cellContainer.addEventListener("click", handleLeftClick);
  cellContainer.addEventListener("contextmenu", handleRightClick);
  playField.append(gameName, cellContainer);
  main.appendChild(playField);
}

function handleRightClick(event) {
  event.preventDefault();
  if (event.target.classList.contains("cell")) {
    currentCells[event.target.id].textContent = "X";
  }
}

function handleLeftClick(event) {
  if (event.target.classList.contains("cell")) {
    event.target.classList.toggle("cell--selected");
    currentCellsData[event.target.id].selected =
      !currentCellsData[event.target.id].selected;
    if (isGameWon()) {
      console.log("sdsd");
    }
  }
}

function isGameWon() {
  return currentCellsData.every((cellData) => {
    if (cellData.selected) {
      return cellData.value === 1;
    } else {
      return cellData.value === 0;
    }
  });
}

function createCells(matrix) {
  currentCellsData = [].concat(...matrix);
  return currentCellsData.map((cell, index) => {
    const cellElenent = document.createElement("div");
    cellElenent.id = index;
    cellElenent.classList.add("cell");
    return cellElenent;
  });
}

createPlayField(easyGame.heart);
