import { templates } from "./data.js";
import { formatTimerData } from "./utils.js";

export function createPlayField(template, complexities, selectedComplexity) {
  const matrix = complexities[selectedComplexity][template];
  const gameName = document.createElement("h2");
  gameName.textContent = "Nonograms";
  gameName.classList.add("game-name");

  const sizeControls = document.createElement("div");
  sizeControls.classList.add("controls-container");

  const complexityButtons = Object.keys(complexities).map(
    createComplexityButton
  );

  sizeControls.append(...complexityButtons);

  const templateControls = document.createElement("div");
  templateControls.classList.add("controls-container");
  const templateButtons = templates.map((template) => {
    const button = document.createElement("button");
    button.id = template;
    button.textContent = template;
    button.classList.add("button");
    return button;
  });

  templateControls.append(...templateButtons);

  const timer = document.createElement("div");
  timer.classList.add("timer");
  const minuteElement = document.createElement("span");
  minuteElement.id = "minute-element";
  minuteElement.textContent = formatTimerData(0);
  const colon = document.createTextNode(":");
  const secondElement = document.createElement("span");
  secondElement.id = "second-element";
  secondElement.textContent = formatTimerData(0);

  timer.append(minuteElement, colon, secondElement);

  const gameArea = document.createElement("div");
  gameArea.classList.add("game-area");

  const playField = document.createElement("div");
  playField.classList.add("play-field");

  const horizontalHintsContainer = document.createElement("div");
  horizontalHintsContainer.classList.add("horizontal-hints");

  const verticalHintsContainer = document.createElement("div");
  verticalHintsContainer.classList.add("vertical-hints");

  const { horizontalHintCells, verticalHintCells } = createHintCells(
    matrix,
    selectedComplexity
  );

  verticalHintsContainer.append(...verticalHintCells);
  horizontalHintsContainer.append(...horizontalHintCells);

  const cellContainer = document.createElement("div");
  cellContainer.classList.add(`cell-container--${selectedComplexity}`);
  const currentCellsData = [].concat(...matrix);
  const currentCells = createCells(currentCellsData);
  cellContainer.append(...currentCells);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save game";
  saveButton.classList.add("button");

  const continueButton = document.createElement("button");
  continueButton.textContent = "Continue last game";
  continueButton.classList.add("button");
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset game";
  resetButton.classList.add("button");

  const showSolutionButton = document.createElement("button");
  showSolutionButton.textContent = "Show solution";
  showSolutionButton.classList.add("button");

  const toggleDarkThemeButton = document.createElement("button");
  toggleDarkThemeButton.textContent = "Toggle dark theme";
  toggleDarkThemeButton.classList.add("button");

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

  document
    .querySelector("main")
    .append(gameName, sizeControls, templateControls, timer, gameArea);

  return {
    resetButton,
    showSolutionButton,
    toggleDarkThemeButton,
    saveButton,
    continueButton,
    sizeControls,
    templateControls,
    horizontalHintsContainer,
    verticalHintsContainer,
    cellContainer,
    minuteElement,
    secondElement,
    currentCells,
    currentCellsData,
  };
}

export function createCells(currentCellsData) {
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

export function createHintCells(matrix, selectedComplexity) {
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
        }, [])
        .filter((hint) => hint)
    );
  }
  const horizontalHintCells = horizontalHints.map((horizontalHint) => {
    const horizontalHintElement = document.createElement("div");
    horizontalHintElement.classList.add("horizontal-hints_block");
    horizontalHintElement.classList.add(
      `horizontal-hints_block--${selectedComplexity}`
    );
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
    verticalHintElement.classList.add("vertical-hints_block");
    verticalHintElement.classList.add(
      `vertical-hints_block--${selectedComplexity}`
    );
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

function createComplexityButton(complexity) {
  const button = document.createElement("button");
  button.textContent = complexity;
  button.id = complexity;
  button.classList.add("button");
  return button;
}
