const sliderWrapper = document.querySelector(".slider_wrapper");
const leftArrow = document.getElementById("left_arrow");
const rightArrow = document.getElementById("right_arrow");
const controls = document.querySelectorAll(".control-progress");

let sliderInterval;
let currentControl;

function createSliderItem(slide) {
  const sliderItem = document.createElement("div");
  sliderItem.classList.add("slider_item");

  const sliderImage = document.createElement("img");
  sliderImage.classList.add("slider_image");
  sliderImage.src = slide.image;
  sliderImage.alt = slide.alt;

  const sliderName = document.createElement("h3");
  sliderName.classList.add("slider_name");
  sliderName.textContent = slide.name;

  const sliderInfo = document.createElement("p");
  sliderInfo.classList.add("slider_description");
  sliderInfo.textContent = slide.info;

  const sliderPrice = document.createElement("p");
  sliderPrice.classList.add("slider_price");
  sliderPrice.textContent = slide.price;

  sliderItem.append(sliderImage, sliderName, sliderInfo, sliderPrice);

  return sliderItem;
}

const slides = CAROUSEL.map(createSliderItem);

sliderWrapper.append(...slides);

function switchRightArrow() {
  const leftValue = parseInt(sliderWrapper.style.left) || 0;
  if (leftValue === 0) {
    sliderWrapper.style.left = "-480px";
    runProgressBar(controls[1]);
  } else if (leftValue === -480) {
    sliderWrapper.style.left = "-960px";
    runProgressBar(controls[2]);
  } else {
    sliderWrapper.style.left = 0;
    runProgressBar(controls[0]);
  }
  runAutoSwitchSliderItem();
}

function switchLeftArrow() {
  const leftValue = parseInt(sliderWrapper.style.left) || 0;
  if (leftValue === 0) {
    sliderWrapper.style.left = "-960px";
    runProgressBar(controls[2]);
  } else if (leftValue === -480) {
    sliderWrapper.style.left = "0";
    runProgressBar(controls[0]);
  } else if (leftValue === -960) {
    sliderWrapper.style.left = "-480px";
    runProgressBar(controls[1]);
  }
  runAutoSwitchSliderItem();
}

rightArrow.addEventListener("click", switchRightArrow);
leftArrow.addEventListener("click", switchLeftArrow);

function runAutoSwitchSliderItem() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
  }
  sliderInterval = setInterval(() => {
    switchRightArrow();
  }, 5000);
}

function runProgressBar(control) {
  if (currentControl) {
    currentControl.classList.remove("control-progress--active");
  }
  control.classList.add("control-progress--active");
  currentControl = control;
}

// Init:

runAutoSwitchSliderItem();
runProgressBar(controls[0]);
