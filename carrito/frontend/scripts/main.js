const serverURL = 'http://127.0.0.1:5500/';
const itemsPath = 'mock/items.json';
const imagesPath = 'img/';

window.onload = getData();

const items = document.querySelector('.items');
console.log('🔥: items', items);

function getData() {
  fetch(`${serverURL}${itemsPath}`)
    .then((response) => response.json())
    // .then((data) => console.log(data))
    .then((data) => printData(data))
}

function printData(data) {
  const itemContainer = document.createElement('div');
  itemContainer.className = 'row';
  data.forEach(item => {
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