const menuContainer = document.querySelector(".menu_container");
const tabs = [...document.querySelectorAll(".tab")];
const loadButton = document.querySelector(".menu_load");

let currentTab = tabs[0];

function createMenuItem(menu) {
  const item = document.createElement("div");
  item.classList.add("menu_item");
  const image = document.createElement("img");
  image.src = menu.image;
  image.alt = menu.alt;
  image.classList.add("menu_image");
  const info = document.createElement("div");
  info.classList.add("menu_info");
  const name = document.createElement("h3");
  name.classList.add("menu_name");
  name.textContent = menu.name;
  const description = document.createElement("p");
  description.classList.add("menu_description");
  description.textContent = menu.info;
  const price = document.createElement("p");
  price.classList.add("menu_price");
  price.textContent = menu.price;
  info.append(name, description, price);
  item.append(image, info);
  return item;
}

function init() {
  menuContainer.append(...FULL_MENU.coffee.map(createMenuItem));
  handleCategoriesDisplay();
}

init();

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    menuContainer.replaceChildren(...FULL_MENU[tab.id].map(createMenuItem));
    currentTab.classList.remove("tab--checked");
    tab.classList.add("tab--checked");
    currentTab = tab;
    handleCategoriesDisplay();
  });
});

function handleCategoriesDisplay() {
  if (window.innerWidth < 769) {
    if (FULL_MENU[currentTab.id].length > 4) {
      menuContainer.classList.add("menu_container--collapsed");
      loadButton.classList.add("menu_load--shown");
    } else {
      loadButton.classList.remove("menu_load--shown");
      menuContainer.classList.remove("menu_container--collapsed");
    }
  }

  if (window.innerWidth >= 769) {
    loadButton.classList.remove("menu_load--shown");
    menuContainer.classList.remove("menu_container--collapsed");
  }
}

window.addEventListener("resize", handleCategoriesDisplay);
loadButton.addEventListener("click", () => {
  menuContainer.classList.remove("menu_container--collapsed");
  loadButton.classList.remove("menu_load--shown");
});
