const body = document.querySelector("body");
const burger = document.querySelector(".burger");
const burgerIcon = document.querySelector(".burger_icon");

function toggleBurger() {
  burger.classList.toggle("burger--shown");
  burgerIcon.classList.toggle("burger_icon--checked");
  body.classList.toggle("disable-scrolling");
}

burgerIcon.addEventListener("click", toggleBurger);
