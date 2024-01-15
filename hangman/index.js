const arrayOfLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const questionsInfo = [
  {
    question: "How many legs does a spider have?",
    answer: ["E", "I", "G", "H", "T"],
  },
  {
    question: "Emerald color",
    answer: ["G", "R", "E", "E", "N"],
  },
  {
    question: "The fastest land animal",
    answer: ["C", "H", "E", "E", "T", "A", "H"],
  },
  {
    question: "Sweet food made by bees",
    answer: ["H", "O", "N", "E", "Y"],
  },
  {
    question: "The closest star to Earth",
    answer: ["S", "U", "N"],
  },
  {
    question: "The hardest natural substance",
    answer: ["D", "I", "A", "M", "O", "N", "D"],
  },
  {
    question: "The name of molten rock after a volcanic eruption",
    answer: ["L", "A", "V", "A"],
  },
  {
    question: "A group of lions",
    answer: ["P", "R", "I", "D", "E"],
  },
  {
    question: "Trick-or-treating holiday",
    answer: ["H", "A", "L", "L", "O", "W", "E", "E", "N"],
  },
  {
    question: "Nemo fish type",
    answer: ["C", "L", "O", "W", "N", "F", "I", "S", "H"],
  },
];

const gallowsComponents = [
  {
    class: "gallows_head",
    src: "./image/head.png",
    alt: "head",
  },
  {
    class: "gallows_body",
    src: "image/body.png",
    alt: "body",
  },
  {
    class: "gallows_hand-one",
    src: "image/hand-one.png",
    alt: "left hand",
  },
  {
    class: "gallows_hand-two",
    src: "image/hand-two.png",
    alt: "right hand",
  },
  {
    class: "gallows_leg-one",
    src: "image/leg-one.png",
    alt: "left leg",
  },
  {
    class: "gallows_leg-two",
    src: "image/leg-two.png",
    alt: "right leg",
  },
];

const body = document.querySelector("body");

let currentTask;
let mainGameElement;
let letterContainers;
let failAttempts = 0;

let gallowsHead;
let gallowsBody;
let gallowsHandOne;
let gallowsHandTwo;
let gallowsLegOne;
let gallowsLegTwo;

let keyboard;

function generateCurrentTask() {
  const lastActiveTask = localStorage.getItem("lastActiveTask");
  const randomTask =
    questionsInfo[Math.floor(Math.random() * questionsInfo.length)];
  if (currentTask === randomTask || lastActiveTask === randomTask.question) {
    generateCurrentTask();
  } else {
    currentTask = randomTask;
    localStorage.setItem("lastActiveTask", currentTask.question);
  }
}

function createGallows(elementInfo) {
  const gallowsElement = document.createElement("img");
  gallowsElement.classList.add(elementInfo.class);
  gallowsElement.src = elementInfo.src;
  gallowsElement.alt = elementInfo.alt;

  return gallowsElement;
}

function createLetterContainers(currentTask) {
  return currentTask.answer.map(() => {
    const letterContainer = document.createElement("span");
    letterContainer.classList.add("entry-field_letter");
    return letterContainer;
  });
}

function createKeyboard(arrayOfLetters) {
  keyboard = arrayOfLetters.map((letter) => {
    const button = document.createElement("button");
    button.classList.add("button");
    button.textContent = letter;
    button.addEventListener("click", () => {
      takeTurn(letter);
      button.classList.add("button--disabled");
    });
    return button;
  });
  return keyboard;
}

function createModal() {
  const modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal_wrapper");
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const notice = document.createElement("p");
  notice.classList.add("notice");
  if (failAttempts === 6) {
    notice.textContent = "You lose! :(";
  } else if (isLetterContainersFull()) {
    notice.textContent = "You are winner! Congratulation!";
  }

  const secretWord = document.createElement("p");
  secretWord.classList.add("notice");
  secretWord.textContent = `Secret word: ${currentTask.answer.join("")}`;

  const buttonPlayAgain = document.createElement("button");
  buttonPlayAgain.classList.add("button_play-again");
  buttonPlayAgain.textContent = "Play again";
  buttonPlayAgain.addEventListener("click", () => playAgain());

  modal.append(notice, secretWord, buttonPlayAgain);
  modalWrapper.appendChild(modal);
  return { modalWrapper, buttonPlayAgain };
}

function initGame() {
  generateCurrentTask();

  const main = document.createElement("main");

  const gameName = document.createElement("h1");
  gameName.classList.add("game-name");
  gameName.textContent = "Hangman";
  const gameStart = document.createElement("h2");
  gameStart.textContent = "Start of the game";

  const playingField = document.createElement("section");
  playingField.classList.add("playing-field");

  const gallowsWrapper = document.createElement("div");
  gallowsWrapper.classList.add("gallows_wrapper");

  const gallows = document.createElement("img");
  gallows.classList.add("gallows");
  gallows.src = "image/gallows.png";
  gallows.alt = "gallows";

  const [head, body, handOne, handTwo, legOne, legTwo] =
    gallowsComponents.map(createGallows);

  gallowsHead = head;
  gallowsBody = body;
  gallowsHandOne = handOne;
  gallowsHandTwo = handTwo;
  gallowsLegOne = legOne;
  gallowsLegTwo = legTwo;

  gallowsWrapper.append(gallows, head, body, handOne, handTwo, legOne, legTwo);

  const userIteraction = document.createElement("div");
  userIteraction.classList.add("user-iteraction");
  const entryField = document.createElement("div");
  entryField.classList.add("entry-field");

  letterContainers = createLetterContainers(currentTask);

  entryField.append(...letterContainers);

  const hintWrapper = document.createElement("div");
  hintWrapper.classList.add("hint_wrapper");

  const hintText = document.createElement("span");
  hintText.textContent = "Hint: ";
  const hintDescription = document.createElement("span");
  hintDescription.classList.add("hint_description");
  hintDescription.textContent = currentTask.question;
  hintWrapper.append(hintText, hintDescription);

  const moveCounter = document.createElement("div");
  moveCounter.classList.add("move-counter");
  const counterText = document.createElement("p");
  const text = document.createTextNode("Incorrect guesses: ");
  const counter = document.createElement("span");
  counter.classList.add("counter");
  counter.textContent = failAttempts;
  counter.id = "counter";
  const moveQuantity = document.createTextNode(" / 6");

  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  const arrayOfButtons = createKeyboard(arrayOfLetters);
  keyboard.append(...arrayOfButtons);

  counterText.append(text, counter, moveQuantity);

  moveCounter.appendChild(counterText);
  userIteraction.append(entryField, hintWrapper, moveCounter, keyboard);

  playingField.append(gallowsWrapper, userIteraction);

  main.append(gameName, gameStart, playingField);
  mainGameElement = main;
  return main;
}

function takeTurn(letter) {
  const matchIndices = currentTask.answer.reduce((accum, element, index) => {
    if (element === letter) {
      accum.push(index);
    }
    return accum;
  }, []);
  matchIndices.forEach((matchIndex) => {
    letterContainers[matchIndex].textContent = letter;
  });

  if (matchIndices.length === 0) {
    failAttempts++;
    showGallowsElement(failAttempts);
    counter.textContent = failAttempts;
  }
  if (failAttempts === 6 || isLetterContainersFull()) {
    const { modalWrapper, buttonPlayAgain } = createModal();
    mainGameElement.appendChild(modalWrapper);
    buttonPlayAgain.focus();
  }
}

function isLetterContainersFull() {
  return letterContainers.every(
    (container) => !!container.textContent === true
  );
}

function showGallowsElement(failAttempts) {
  switch (failAttempts) {
    case 1:
      gallowsHead.classList.add("show-element");
      break;
    case 2:
      gallowsBody.classList.add("show-element");
      break;
    case 3:
      gallowsHandOne.classList.add("show-element");
      break;
    case 4:
      gallowsHandTwo.classList.add("show-element");
      break;
    case 5:
      gallowsLegOne.classList.add("show-element");
      break;
    case 6:
      gallowsLegTwo.classList.add("show-element");
      break;
  }
}

function playAgain() {
  failAttempts = 0;
  body.removeChild(mainGameElement);
  body.appendChild(initGame());
}

body.appendChild(initGame());

document.addEventListener("keydown", (e) => {
  const index = arrayOfLetters.indexOf(e.key.toLocaleUpperCase());
  if (arrayOfLetters.includes(e.key.toLocaleUpperCase())) {
    takeTurn(e.key.toLocaleUpperCase());
    keyboard[index].classList.add("button--disabled");
  }
});
