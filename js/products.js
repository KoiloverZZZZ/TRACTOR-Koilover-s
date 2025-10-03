import { products } from "./mockDB.js"

export function loadProducts() {
    return products;
}

export function renderProductCard(product) {
    return `
    <div class="f" data-id="${product.id}">
      <img src="${product.image}" class="photo" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">${product.price} ₽</p>
      <button class="view-button">Посмотреть товар</button>
    </div>
  `;
}

export function renderProductList(container) {
    const products = loadProducts();
    container.innerHTML = products.map(renderProductCard).join('');
    // Добавляем обработчики кликов
    container.querySelectorAll('.f').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.id;
            window.location.href = `products.html?id=${productId}`;
        });
    });
}

export function renderProductDetails(product) {
    return `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h1>${product.name}</h1>
          <p class="price">${product.price} ₽</p>
          <div class="specs">
            <h3>Описание</h3>
            <p>${product.description}</p>
          </div>
          <div class="specs">
            <h3>Характеристики</h3>
            <ul>
              <li><strong>Производитель:</strong> ${product.manufacturer}</li>
              <li><strong>Материал:</strong> ${product.material}</li>
              <li><strong>Диаметр:</strong> ${product.diameter}</li>
              <li><strong>Ширина:</strong> ${product.width}</li>
              <li><strong>Вылет (ET):</strong> ${product.offset}</li>
              <li><strong>PCD:</strong> ${product.pcd}</li>
              <li><strong>Цвет:</strong> ${product.color}</li>
              <li><strong>Вес:</strong> ${product.weight}</li>
            </ul>
          </div>
          <button class="buy-button">Купить</button>
        </div>
    `;
}