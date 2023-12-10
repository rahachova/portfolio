const body = document.querySelector("body");
const menuContainer = document.querySelector(".menu_container");
const tabs = [...document.querySelectorAll(".tab")];
const loadButton = document.querySelector(".menu_load");
const modalsOverlay = document.querySelector(".modals");

let modal;

let currentPrice = 0;
let sizePrice = 0;
let currentModalTotalPriceElement;
let additionsSelected = 0;

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
  price.textContent = `$${menu.price.toPrecision(3)}`;
  info.append(name, description, price);
  item.append(image, info);
  item.addEventListener("click", () => {
    if (modal) {
      modal.remove();
    }
    modal = createMenuModal(menu);
    modalsOverlay.appendChild(modal);
    modalsOverlay.classList.add("modals--shown");
    body.classList.add("disable-scrolling");
  });
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

function createModalSizeButtons(sizes) {
  return sizes.map((sizeData) => {
    const modalTab = document.createElement("button");
    modalTab.classList.add("tab", "modal_tab");

    const modalTabButton = document.createElement("span");
    modalTabButton.classList.add("tab_button", "modal_tab-button");
    modalTabButton.textContent = sizeData.size;

    const modalTabButtonSize = document.createElement("span");
    modalTabButtonSize.classList.add("modal_tab-size");

    const modalTabButtonValue = document.createElement("span");
    modalTabButtonValue.classList.add("modal_tab-size-value");
    modalTabButtonValue.textContent = sizeData.value;

    modalTabButtonSize.appendChild(modalTabButtonValue);
    modalTabButtonSize.appendChild(
      document.createTextNode(` ${sizeData.unit}`)
    );
    modalTab.append(modalTabButton, modalTabButtonSize);
    if (sizeData.checked) {
      modalTab.classList.add("tab--checked");
      modalTabButtonValue.classList.add("tab--checked");
      modalTabButtonSize.classList.add("tab--checked");
    }
    modalTab.addEventListener("click", () => {
      sizePrice = sizeData.sizePrice;
      recalculate();
    });

    return modalTab;
  });
}

function createModalAdditives(additives) {
  return additives.map((additivesData, index) => {
    const modalTab = document.createElement("button");
    modalTab.classList.add("tab", "modal_tab");

    const modalTabButton = document.createElement("span");
    modalTabButton.classList.add("tab_button", "modal_tab-button");
    modalTabButton.textContent = index + 1;

    const modalTabButtonText = document.createElement("span");
    modalTabButtonText.classList.add("modal_tab-size");
    modalTabButtonText.textContent = additivesData;

    modalTab.append(modalTabButton, modalTabButtonText);

    modalTab.addEventListener("click", () => {
      additionsSelected++;
      recalculate();
    });

    return modalTab;
  });
}

function createAdditivesWrapper(additives) {
  const additiveWrapper = document.createElement("div");
  const modalText = document.createElement("div");
  modalText.classList.add("modal_text", "modal_tab-header");
  modalText.textContent = "Additives";
  const modalTabs = document.createElement("div");
  modalTabs.classList.add("modal_tabs");
  modalTabs.append(...createModalAdditives(additives));
  additiveWrapper.append(modalText, modalTabs);

  return additiveWrapper;
}

function createSizeWrapper(sizes) {
  const sizeWrapper = document.createElement("div");
  const modalText = document.createElement("div");
  modalText.classList.add("modal_text", "modal_tab-header");
  modalText.textContent = "Size";
  const modalTabs = document.createElement("div");
  modalTabs.classList.add("modal_tabs");
  modalTabs.append(...createModalSizeButtons(sizes));
  sizeWrapper.append(modalText, modalTabs);

  return sizeWrapper;
}

function createMenuModal(menuItem) {
  const productConfig = PRODUCT_CONFIG[menuItem.type];

  currentPrice = menuItem.price;

  const modal = document.createElement("div");
  modal.classList.add("modal");
  const image = document.createElement("img");
  image.src = menuItem.image;
  image.alt = menuItem.alt;
  image.classList.add("modal_image");

  const modalInfo = document.createElement("div");
  modalInfo.classList.add("modal_info");
  const descriptionWrapper = document.createElement("div");

  const modalName = document.createElement("h3");
  modalName.classList.add("modal_name");
  modalName.textContent = menuItem.name;

  const modalText = document.createElement("p");
  modalText.classList.add("modal_text");
  modalText.textContent = menuItem.info;

  descriptionWrapper.append(modalName, modalText);

  const sizeWrapper = createSizeWrapper(productConfig.sizes);

  const additivesWrapper = createAdditivesWrapper(productConfig.additives);

  const modalTotal = document.createElement("div");
  modalTotal.classList.add("modal_total");
  const modalTotalText = document.createElement("p");
  modalTotalText.textContent = "Total";
  const modalTotalPrice = document.createElement("p");
  currentModalTotalPriceElement = modalTotalPrice;
  modalTotalPrice.textContent = `$${menuItem.price.toPrecision(3)}`;
  modalTotal.append(modalTotalText, modalTotalPrice);

  const modalHint = document.createElement("div");
  modalHint.classList.add("modal_hint");
  modalHint.innerHTML = `<svg
  class="modal_hint-icon"
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
>
  <g clip-path="url(#clip0_268_9737)">
    <path
      d="M8 7.66663V11"
      stroke="#403F3D"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 5.00667L8.00667 4.99926"
      stroke="#403F3D"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
      stroke="#403F3D"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <defs>
    <clipPath id="clip0_268_9737">
      <rect width="16" height="16" fill="white" />
    </clipPath>
  </defs>
</svg>`;

  const modalHintText = document.createElement("p");
  modalHintText.classList.add("hint_text");
  modalHintText.textContent =
    "The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.";

  modalHint.appendChild(modalHintText);

  const modalCloseButton = document.createElement("button");
  modalCloseButton.classList.add("modal_close-button");
  modalCloseButton.textContent = "Close";

  modalCloseButton.addEventListener("click", () => {
    modalsOverlay.classList.remove("modals--shown");
    body.classList.remove("disable-scrolling");
    additionsSelected = 0;
    currentPrice = 0;
    sizePrice = 0;
  });

  modalsOverlay.addEventListener("click", (event) => {
    if (event.target === modalsOverlay) {
      modalsOverlay.classList.remove("modals--shown");
      body.classList.remove("disable-scrolling");
      additionsSelected = 0;
      currentPrice = 0;
      sizePrice = 0;
    }
  });

  modalInfo.append(
    descriptionWrapper,
    sizeWrapper,
    additivesWrapper,
    modalTotal,
    modalHint,
    modalCloseButton
  );

  modal.append(image, modalInfo);
  return modal;
}

function recalculate() {
  currentModalTotalPriceElement.textContent = `$${(
    currentPrice +
    sizePrice +
    additionsSelected * 0.5
  ).toPrecision(3)}`;
}
