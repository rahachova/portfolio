import { complexities, templates } from "./modules/data.js";
import {
  createPlayField,
  createCells,
  createHintCells,
} from "./modules/play-field.js";
import {
  formatTimerData,
  isGameWon,
  resetGame,
  showSolution,
  toggleDarkTheme,
  clearTimer,
} from "./modules/utils.js";
import { createModal } from "./modules/modal.js";

const timer = {
  minutes: 0,
  seconds: 0,
  timerCounter: undefined,
};

let selectedComplexity = "easy";
let template = templates[0];

let {
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
} = createPlayField(template, complexities, selectedComplexity);

cellContainer.addEventListener("click", handleLeftClick);
cellContainer.addEventListener("contextmenu", handleRightClick);
saveButton.addEventListener("click", () => {
  localStorage.setItem(
    "saving",
    JSON.stringify({ currentCellsData, template, selectedComplexity })
  );
});
continueButton.addEventListener("click", () => {
  const savedGame = JSON.parse(localStorage.getItem("saving"));
  currentCellsData = savedGame.currentCellsData;
  template = savedGame.template;
  selectedComplexity = savedGame.selectedComplexity;
  const matrix = complexities[selectedComplexity][template];
  reinitializeCells(matrix);
});
resetButton.addEventListener("click", () => {
  resetGame(currentCells, currentCellsData, timer);
  clearTimer(timer, minuteElement, secondElement);
});
showSolutionButton.addEventListener("click", () =>
  showSolution(currentCells, currentCellsData)
);
toggleDarkThemeButton.addEventListener("click", toggleDarkTheme);
sizeControls.addEventListener("click", (event) => {
  if (event.target.classList.contains("button")) {
    selectedComplexity = event.target.id;
    const matrix = complexities[selectedComplexity][template];
    currentCellsData = [].concat(...matrix);
    reinitializeCells(matrix);
  }
});
templateControls.addEventListener("click", (event) => {
  if (event.target.classList.contains("button")) {
    template = event.target.id;
    const matrix = complexities[selectedComplexity][template];
    currentCellsData = [].concat(...matrix);
    reinitializeCells(matrix);
  }
});

function reinitializeCells(matrix) {
  currentCells = createCells(currentCellsData);
  cellContainer.replaceChildren(...currentCells);
  cellContainer.className = `cell-container--${selectedComplexity}`;
  const { horizontalHintCells, verticalHintCells } = createHintCells(
    matrix,
    selectedComplexity
  );

  verticalHintsContainer.replaceChildren(...verticalHintCells);
  horizontalHintsContainer.replaceChildren(...horizontalHintCells);
  [...verticalHintsContainer.children].forEach((hintsBlock) => {
    hintsBlock.className = `vertical-hints_block vertical-hints_block--${selectedComplexity}`;
  });
  [...horizontalHintsContainer.children].forEach((hintsBlock) => {
    hintsBlock.className = `horizontal-hints_block horizontal-hints_block--${selectedComplexity}`;
  });
}

function startTimer() {
  if (!timer.timerCounter) {
    timer.timerCounter = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  if (timer.seconds == 60) {
    timer.seconds = 0;
    timer.minutes++;
  } else {
    timer.seconds++;
  }

  minuteElement.textContent = formatTimerData(timer.minutes);
  secondElement.textContent = formatTimerData(timer.seconds);
}

function handleRightClick(event) {
  event.preventDefault();
  if (event.target.classList.contains("cell")) {
    startTimer();
    currentCells[event.target.id].textContent = "X";
    currentCellsData[event.target.id].crossed =
      !currentCellsData[event.target.id].crossed;

    const audioRightClick = new Audio();
    audioRightClick.src = "./assets/right-click.mp3";
    audioRightClick.play();
  }
}

function handleLeftClick(event) {
  if (event.target.classList.contains("cell")) {
    startTimer();
    event.target.classList.toggle("cell--selected");
    currentCellsData[event.target.id].selected =
      !currentCellsData[event.target.id].selected;
    if (isGameWon(currentCellsData)) {
      createModal(timer);
      clearTimer(timer, minuteElement, secondElement);
      const audioWin = new Audio();
      audioWin.src = "./assets/win.mp3";
      audioWin.play();
    }
    const audioLeftClick = new Audio();
    audioLeftClick.src = "./assets/left-click.mp3";
    audioLeftClick.play();
  }
}
