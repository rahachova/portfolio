const FULL_MENU = {
  coffee: [
    {
      name: "Irish coffee",
      image: "./assets/images/coffee/coffee-1.png",
      info: "Fragrant black coffee with Jameson Irish whiskey and whipped milk",
      price: "$7.00",
      alt: "Irish coffee",
    },
    {
      name: "Kahlua coffee",
      image: "./assets/images/coffee/coffee-2.png",
      info: "Classic coffee with milk and Kahlua liqueur under a cap of frothed milk",
      price: "$7.00",
      alt: "Kahlua coffee",
    },
    {
      name: "Honey raf",
      image: "./assets/images/coffee/coffee-3.png",
      info: "Espresso with frothed milk, cream and aromatic honey",
      price: "$5.50",
      alt: "Honey raf",
    },
    {
      name: "Ice cappuccino",
      image: "./assets/images/coffee/coffee-4.png",
      info: "Cappuccino with soft thick foam in summer version with ice",
      price: "$5.00",
      alt: "Ice cappuccino",
    },
    {
      name: "Espresso",
      image: "./assets/images/coffee/coffee-5.png",
      info: "Classic black coffee",
      price: "$4.50",
      alt: "Espresso",
    },
    {
      name: "Latte",
      image: "./assets/images/coffee/coffee-6.png",
      info: "Espresso coffee with the addition of steamed milk and dense milk foam",
      price: "$5.50",
      alt: "Latte",
    },
    {
      name: "Latte macchiato",
      image: "./assets/images/coffee/coffee-7.png",
      info: "Espresso with frothed milk and chocolate",
      price: "$5.50",
      alt: "Latte macchiato",
    },
    {
      name: "Coffee with cognac",
      image: "./assets/images/coffee/coffee-8.png",
      info: "Fragrant black coffee with cognac and whipped cream",
      price: "$6.50",
      alt: "Coffee with cognac",
    },
  ],
  tea: [
    {
      name: "Moroccan",
      image: "./assets/images/tea/tea-1.png",
      info: "Fragrant black tea with the addition of tangerine, cinnamon, honey, lemon and mint",
      price: "$4.50",
      alt: "Moroccan tea",
    },
    {
      name: "Ginger",
      image: "./assets/images/tea/tea-2.png",
      info: "Original black tea with fresh ginger, lemon and honey",
      price: "$5.00",
      alt: "Ginger tea",
    },
    {
      name: "Cranberry",
      image: "./assets/images/tea/tea-3.png",
      info: "Invigorating black tea with cranberry and honey",
      price: "$5.00",
      alt: "Cranberry tea",
    },
    {
      name: "Sea buckthorn",
      image: "./assets/images/tea/tea-4.png",
      info: "Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon",
      price: "$5.50",
      alt: "Sea buckthorn tea",
    },
  ],
  dessert: [
    {
      name: "Marble cheesecake",
      image: "./assets/images/dessert/dessert-1.png",
      info: "Philadelphia cheese with lemon zest on a light sponge cake and red currant jam",
      price: "$3.50",
      alt: "Marble cheesecake",
    },
    {
      name: "Red velvet",
      image: "./assets/images/dessert/dessert-2.png",
      info: "Layer cake with cream cheese frosting",
      price: "$4.00",
      alt: "Red velvet",
    },
    {
      name: "Cheesecakes",
      image: "./assets/images/dessert/dessert-3.png",
      info: "Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar",
      price: "$4.50",
      alt: "Cheesecakes",
    },
    {
      name: "Creme brulee",
      image: "./assets/images/dessert/dessert-4.png",
      info: "Delicate creamy dessert in a caramel basket with wild berries",
      price: "$4.00",
      alt: "Creme brulee",
    },
    {
      name: "Pancakes",
      image: "./assets/images/dessert/dessert-5.png",
      info: "Tender pancakes with strawberry jam and fresh strawberries",
      price: "$4.50",
      alt: "Pancakes",
    },
    {
      name: "Honey cake",
      image: "./assets/images/dessert/dessert-6.png",
      info: "Classic honey cake with delicate custard",
      price: "$4.50",
      alt: "Honey cake",
    },
    {
      name: "Chocolate cake",
      image: "./assets/images/dessert/dessert-7.png",
      info: "Cake with hot chocolate filling and nuts with dried apricots",
      price: "$5.50",
      alt: "Chocolate cake",
    },
    {
      name: "Black forest",
      image: "./assets/images/dessert/dessert-8.png",
      info: "A combination of thin sponge cake with cherry jam and light chocolate mousse",
      price: "$6.50",
      alt: "Black forest",
    },
  ],
};

const menuContainer = document.querySelector(".menu_container");
const tabs = [...document.querySelectorAll(".tab")];

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

menuContainer.append(...FULL_MENU.coffee.map(createMenuItem));

// tabs.addEventListener("click", function (event) {
//   menuContainer.replaceChildren(...FULL_MENU[event.target.id].map(createMenuItem));
// });

tabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    menuContainer.replaceChildren(...FULL_MENU[tab.id].map(createMenuItem));
    console.log(event.target === tab);
  });
});
