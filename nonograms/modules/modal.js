export function createModal({ minutes, seconds }) {
  const main = document.querySelector("main");
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
  button.focus();
  button.addEventListener("click", () => {
    main.removeChild(modalWrapper);
  });

  modal.append(modalText, button);
  modalWrapper.appendChild(modal);

  main.appendChild(modalWrapper);
}
