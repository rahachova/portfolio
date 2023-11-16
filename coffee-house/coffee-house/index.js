const fullMenu = {
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
      info: "Fragrant black coffee with cognac and whipped cream",
      price: "$6.50",
      alt: "Coffee with cognac",
    }
  ]
};

const menuContainer = document.querySelector(".menu_container");
const tabs = document.querySelector(".tabs");

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

menuContainer.append(...fullMenu.coffee.map(createMenuItem));
