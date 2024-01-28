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
  const playField = document.createElement("div");
  playField.classList.add("play-field");
  const gameName = document.createElement("h2");
  gameName.textContent = "Nonograms";
  const cellContainer = document.createElement("div");
  cellContainer.classList.add("cell-container");
  currentCells = createCells(matrix);
  cellContainer.append(...currentCells);
  cellContainer.addEventListener("click", handleLeftClick);
  cellContainer.addEventListener("contextmenu", handleRightClick);

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset game";
  resetButton.addEventListener("click", resetGame);
  playField.append(gameName, cellContainer, resetButton);

  // const modalWrapper = document.createElement("div");
  // modalWrapper.classList.add("modal_wrapper");
  // const modal = document.createElement("div");
  // modal.classList.add("modal");

  // const modalText = document.createElement("p");
  // modalText.textContent = "Great! You have solved the nonogram!";

  // const button = document.createElement("button");
  // button.textContent = "Close";

  // modal.append(modalText, button);
  // modalWrapper.appendChild(modal);

  // main.appendChild(modalWrapper);

  main.appendChild(playField);
}

function resetGame() {
  currentCells.forEach((cell) => {
    cell.classList.remove("cell--selected");
    cell.textContent = "";
  });
  currentCellsData.forEach((cellData) => {
    cellData.selected = false;
  });
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

// function createModal() {
//   const modal = document.createElement('div')
// }

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
