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
let cellContainer;
let verticalHintsContainer;
let horizontalHintsContainer;

let minuteElement;
let minutes = 0;
let secondElement;
let seconds = 0;
let timerCounter;

function createPlayField(matrix) {
  const gameName = document.createElement("h2");
  gameName.textContent = "Nonograms";
  gameName.classList.add("game-name");

  const timer = document.createElement("div");
  minuteElement = document.createElement("span");
  minuteElement.id = "minute-element";
  minuteElement.textContent = formatTimerData(minutes);
  const colon = document.createTextNode(":");
  secondElement = document.createElement("span");
  secondElement.id = "second-element";
  secondElement.textContent = formatTimerData(seconds);

  timer.append(minuteElement, colon, secondElement);

  const gameArea = document.createElement("div");
  gameArea.classList.add("game-area");

  const playField = document.createElement("div");
  playField.classList.add("play-field");

  horizontalHintsContainer = document.createElement("div");
  horizontalHintsContainer.classList.add("horizontal-hints");

  verticalHintsContainer = document.createElement("div");
  verticalHintsContainer.classList.add("vertical-hints");

  const { horizontalHintCells, verticalHintCells } = createHintCells(matrix);

  verticalHintsContainer.append(...verticalHintCells);
  horizontalHintsContainer.append(...horizontalHintCells);

  cellContainer = document.createElement("div");
  cellContainer.classList.add("cell-container");
  currentCellsData = [].concat(...matrix);
  currentCells = createCells(currentCellsData);
  cellContainer.append(...currentCells);
  cellContainer.addEventListener("click", handleLeftClick);
  cellContainer.addEventListener("contextmenu", handleRightClick);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

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
    currentCells = createCells(currentCellsData);
    cellContainer.replaceChildren(...currentCells);
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

  buttonsContainer.append(
    saveButton,
    continueButton,
    resetButton,
    showSolutionButton,
    toggleDarkThemeButton
  );

  const horizontalHintsWithCells = document.createElement("div");
  horizontalHintsWithCells.classList.add("horizontal-hints-with-cells");

  horizontalHintsWithCells.append(horizontalHintsContainer, cellContainer);

  playField.append(verticalHintsContainer, horizontalHintsWithCells);

  gameArea.append(playField, buttonsContainer);

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

  main.append(gameName, timer, gameArea);
  return {
    gameName,
    resetButton,
    showSolutionButton,
    toggleDarkThemeButton,
    saveButton,
    continueButton,
  };
}

// createPlayField(easyGame.heart);

const {
  gameName,
  resetButton,
  showSolutionButton,
  toggleDarkThemeButton,
  saveButton,
  continueButton,
} = createPlayField(easyGame.crown);

function startTimer() {
  if (!timerCounter) {
    timerCounter = setInterval(updateTimer, 1000);
  }
}

function clearTimer() {
  clearInterval(timerCounter);
}

function formatTimerData(input) {
  return input > 9 ? input : `0${input}`;
}

function updateTimer() {
  if (seconds == 60) {
    seconds = 0;
    minutes++;
  } else {
    seconds++;
  }

  minuteElement.textContent = formatTimerData(minutes);
  secondElement.textContent = formatTimerData(seconds);
  // document.getElementById("minute-element").innerText = formatTimerData(minutes);
  // document.getElementById("second-element").innerText = formatTimerData(seconds);
}

function toggleDarkTheme() {
  body.classList.toggle("body--dark");
  gameName.classList.toggle("game-name--dark");
  resetButton.classList.toggle("button--dark");
  showSolutionButton.classList.toggle("button--dark");
  toggleDarkThemeButton.classList.toggle("button--dark");
  saveButton.classList.toggle("button--dark");
  continueButton.classList.toggle("button--dark");
  currentCells.forEach((cell) => {
    cell.classList.toggle("cell--dark");
  });
}

function showSolution() {
  currentCellsData.forEach((cell, index) => {
    if (cell.value) {
      currentCells[index].classList.toggle("cell--selected-shown");
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
    startTimer();
    currentCells[event.target.id].textContent = "X";
    currentCellsData[event.target.id].crossed =
      !currentCellsData[event.target.id].crossed;
  }
}

function handleLeftClick(event) {
  if (event.target.classList.contains("cell")) {
    startTimer();
    event.target.classList.toggle("cell--selected");
    currentCellsData[event.target.id].selected =
      !currentCellsData[event.target.id].selected;
    if (isGameWon()) {
      createModal();
      clearTimer();
    }
  }
}

function createModal() {
  const modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal_wrapper");
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalText = document.createElement("p");
  modalText.textContent = `Great! You have solved the nonogram in ${
    minutes ? minutes : 0
  } minutes and ${seconds} seconds!`;

  const button = document.createElement("button");
  button.textContent = "Close";

  modal.append(modalText, button);
  modalWrapper.appendChild(modal);

  main.appendChild(modalWrapper);
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

function createCells(currentCellsData) {
  return currentCellsData.map((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.id = index;
    cellElement.classList.add("cell");
    if (cell.selected) {
      cellElement.classList.add("cell--selected");
    }
    if (cell.crossed) {
      cellElement.textContent = "X";
    }
    return cellElement;
  });
}

function createHintCells(matrix) {
  const verticalHints = matrix.map((verticalLine) => {
    return verticalLine
      .reduce((hint, cellData) => {
        if (cellData.value) {
          return incrementHintWithValue(hint);
        } else {
          return incrementHintWithEmptyValue(hint);
        }
      }, [])
      .filter((hint) => hint);
  });
  const horizontalHints = [];
  for (let currentLine = 0; currentLine < matrix.length; currentLine++) {
    const currentVerticalCells = matrix.map(
      (horizontalCells) => horizontalCells[currentLine]
    );

    horizontalHints.push(
      currentVerticalCells
        .reduce((hint, cellData) => {
          if (cellData.value) {
            return incrementHintWithValue(hint);
          } else {
            return incrementHintWithEmptyValue(hint);
          }
        }, "")
        .filter((hint) => hint)
    );
  }
  const horizontalHintCells = horizontalHints.map((horizontalHint) => {
    const horizontalHintElement = document.createElement("div");
    horizontalHintElement.append(
      ...horizontalHint.map((hint) => {
        const hintElement = document.createElement("div");
        hintElement.textContent = hint;
        hintElement.classList.add("hint");
        return hintElement;
      })
    );
    return horizontalHintElement;
  });
  const verticalHintCells = verticalHints.map((verticalHint) => {
    const verticalHintElement = document.createElement("div");
    verticalHintElement.append(
      ...verticalHint.map((hint) => {
        const hintElement = document.createElement("div");
        hintElement.textContent = hint;
        hintElement.classList.add("hint");
        return hintElement;
      })
    );
    return verticalHintElement;
  });
  return { horizontalHintCells, verticalHintCells };
}

function incrementHintWithValue(hint) {
  if (!hint.length) {
    return [1];
  } else {
    const lastDigit = hint[hint.length - 1];
    if (lastDigit) {
      const newHint = hint.slice(0, hint.length - 1);
      newHint.push(lastDigit + 1);
      return newHint;
    } else {
      return [...hint, 1];
    }
  }
}

function incrementHintWithEmptyValue(hint) {
  return [...hint, 0];
}
