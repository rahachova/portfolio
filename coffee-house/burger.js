const burger = document.querySelector(".burger");
const burgerIcon = document.querySelector(".burger_icon");

let currentWidth = window.innerWidth;
let isBurgerOpen = false;

function toggleBurger() {
  burger.classList.toggle("burger--shown");
  burgerIcon.classList.toggle("burger_icon--checked");
  body.classList.toggle("disable-scrolling");
  isBurgerOpen = !isBurgerOpen;
}

function handleResize() {
  if (currentWidth < 769 && window.innerWidth >= 769 && isBurgerOpen) {
    toggleBurger();
  }
  currentWidth = window.innerWidth;
}
burgerIcon.addEventListener("click", toggleBurger);

window.addEventListener("resize", handleResize);
