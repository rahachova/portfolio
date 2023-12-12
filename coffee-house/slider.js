const sliderWrapper = document.querySelector(".slider_wrapper");
const leftArrow = document.getElementById("left_arrow");
const rightArrow = document.getElementById("right_arrow");

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

sliderWrapper.append(...CAROUSEL.map(createSliderItem));

function switchRightArrow() {
  const leftValue = parseInt(sliderWrapper.style.left) || 0;
  if (leftValue > -1900) {
    sliderWrapper.style.left = leftValue - 480 + "px";
  }
}

function switchLeftArrow() {
  const leftValue = parseInt(sliderWrapper.style.left) || 0;
  if (leftValue < 0) {
    sliderWrapper.style.left = leftValue + 480 + "px";
  }
}

rightArrow.addEventListener("click", switchRightArrow);
leftArrow.addEventListener("click", switchLeftArrow);
