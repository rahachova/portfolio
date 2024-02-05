export function formatTimerData(input) {
  return input > 9 ? input : `0${input}`;
}

export function isGameWon(currentCellsData) {
  return currentCellsData.every((cellData) => {
    if (cellData.selected) {
      return cellData.value === 1;
    } else {
      return cellData.value === 0;
    }
  });
}

export function resetGame(currentCells, currentCellsData) {
  currentCells.forEach((cell) => {
    cell.classList.remove("cell--selected");
    cell.textContent = "";
  });
  currentCellsData.forEach((cellData) => {
    cellData.selected = false;
    cellData.crossed = false;
  });
}

export function clearTimer(timer, minuteElement, secondElement) {
  clearInterval(timer.timerCounter);
  timer.timerCounter = undefined;
  timer.minutes = 0;
  timer.seconds = 0;
  minuteElement.textContent = "00";
  secondElement.textContent = "00";
}

export function showSolution(currentCells, currentCellsData) {
  currentCellsData.forEach((cell, index) => {
    if (cell.value) {
      currentCells[index].classList.toggle("cell--selected-shown");
    } else {
      currentCells[index].classList.toggle("cell--selected-hidden");
    }
  });
}

export function toggleDarkTheme() {
  document.querySelector("body").classList.toggle("dark-theme");
}
