// const serverURL = 'http://127.0.0.1:5500/';
const serverURL = 'http://localhost:4000/';
const itemsPath = 'items/';
const imagesPath = 'img/';

window.onload = getData();

const items = document.querySelector('.items');
// console.log('🔥: items', items);

function getData() {
  fetch(`${serverURL}${itemsPath}`)
    .then((response) => response.json())
    // .then((data) => console.log(data))
    .then((data) => printData(data))
}

function printData(data) {
  const itemContainer = document.createElement('div');
  itemContainer.className = 'row';
  data.forEach((item) => {
    itemContainer.innerHTML += createDomElement(item);
    items.append(itemContainer)
  });
}

function createDomElement(item) {
  const itemHTML = `
    <div class="col-12 col-md-6">
      <div class="item shadow mb-4">
        <h3 class="item-title">${item.title}</h3>
        <img class="item-image" src=${serverURL}${imagesPath}${item.image}>

        <div class="item-details">
          <h4 class="item-price">${item.price}€</h4>
          <button class="item-button btn btn-primary addToCart">AÑADIR AL CARRITO</button>
        </div>
      </div>
    </div>`
    return itemHTML;
}

function createShoppingCartItem(item) {
  const scItemHTML = `
  <div class="col-6">
  <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
      <img src=${serverURL}${imagesPath}${item.image} class="shopping-cart-image">
      <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${item.title}
      </h6>
  </div>
</div>
<div class="col-2">
  <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
      <p class="item-price mb-0 shoppingCartItemPrice">${item.price}€</p>
  </div>
</div>
<div class="col-4">
  <div
      class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
      <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
          value="1">
      <button class="btn btn-danger buttonDelete" type="button">X</button>
  </div>
</div>
  `
}