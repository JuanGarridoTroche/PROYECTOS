const serverURL = 'http://127.0.0.1:5500/';
const itemsPath = 'mock/items.json';
const imagesPath = 'img/';

window.onload = getData();

const items = document.querySelector('.items');

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