const easyGame = {
  heart: [
    [
      { value: 0, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
    ],
    [
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
    ],
    [
      { value: 0, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
    ],
    [
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
    ],
    [
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
    ],
  ],
  crown: [
    [
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
    ],
    [
      { value: 1, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
    ],
    [
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
    ],
    [
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
      { value: 1, selected: false, crossed: false },
    ],
    [
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
      { value: 0, selected: false, crossed: false },
    ],
  ],
};

const main = document.querySelector("main");
const body = document.querySelector("body");
let currentCells;
let currentCellsData;

function createPlayField(matrix) {
  const playField = document.createElement("div");
  playField.classList.add("play-field");
  const gameName = document.createElement("h2");
  gameName.textContent = "Nonograms";
  gameName.classList.add("game-name");
  const cellContainer = document.createElement("div");
  cellContainer.classList.add("cell-container");
  currentCells = createCells(matrix);
  cellContainer.append(...currentCells);
  cellContainer.addEventListener("click", handleLeftClick);
  cellContainer.addEventListener("contextmenu", handleRightClick);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save game";
  saveButton.classList.add("button");
  saveButton.addEventListener("click", () => {
    localStorage.setItem("saving", JSON.stringify(currentCellsData));
  });

  const continueButton = document.createElement("button");
  continueButton.textContent = "Continue last game";
  continueButton.classList.add("button");
  continueButton.addEventListener("click", () => {
    currentCellsData = JSON.parse(localStorage.getItem("saving"));
    createPlayField(currentCellsData);
  });

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset game";
  resetButton.classList.add("button");
  resetButton.addEventListener("click", resetGame);

  const showSolutionButton = document.createElement("button");
  showSolutionButton.textContent = "Show solution";
  showSolutionButton.classList.add("button");
  showSolutionButton.addEventListener("click", showSolution);

  const toggleDarkThemeButton = document.createElement("button");
  toggleDarkThemeButton.textContent = "Toggle dark theme";
  toggleDarkThemeButton.classList.add("button");
  toggleDarkThemeButton.addEventListener("click", toggleDarkTheme);

  playField.append(
    gameName,
    cellContainer,
    saveButton,
    continueButton,
    resetButton,
    showSolutionButton,
    toggleDarkThemeButton
  );

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
  return { gameName, resetButton, showSolutionButton, toggleDarkThemeButton };
}

// createPlayField(easyGame.heart);

const { gameName, resetButton, showSolutionButton, toggleDarkThemeButton } =
  createPlayField(easyGame.heart);

function toggleDarkTheme() {
  body.classList.toggle("body--dark");
  gameName.classList.toggle("game-name--dark");
  resetButton.classList.toggle("button--dark");
  showSolutionButton.classList.toggle("button--dark");
  toggleDarkThemeButton.classList.toggle("button--dark");
  currentCells.forEach((cell) => {
    cell.classList.toggle("cell--dark");
  });
}

function showSolution() {
  currentCellsData.forEach((cell, index) => {
    if (cell.value) {
      currentCells[index].classList.toggle("cell--selected");
    }
  });
}

function resetGame() {
  currentCells.forEach((cell) => {
    cell.classList.remove("cell--selected");
    cell.textContent = "";
  });
  currentCellsData.forEach((cellData) => {
    cellData.selected = false;
    cellData.crossed = false;
  });
}

function handleRightClick(event) {
  event.preventDefault();
  if (event.target.classList.contains("cell")) {
    currentCells[event.target.id].textContent = "X";
    currentCellsData[event.target.id].crossed =
      !currentCellsData[event.target.id].crossed;
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
