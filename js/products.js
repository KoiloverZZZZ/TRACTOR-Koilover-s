import { getProducts, saveProducts, getLocalProducts } from "./mockDB.js"

export async function loadProducts() {
    try {
        const localProducts = getLocalProducts();
        if (localProducts && localProducts.length > 0) {
            console.log('Загружены товары из localStorage:', localProducts.length);
            return localProducts;
        }
        
        const jsonProducts = await getProducts();
        console.log('Загружены товары из JSON:', jsonProducts.length);
        return jsonProducts;
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        return [];
    }
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

export async function renderProductList(container) {
    const products = await loadProducts();
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
            <h3>Характеристики:</h3>
            <ul>
              <li><strong>Материал:</strong> ${product.material}</li>
              <li><strong>Диаметр:</strong> ${product.diameter}</li>
              <li><strong>Ширина:</strong> ${product.width}</li>
              <li><strong>Вылет (ET):</strong> ${product.offset}</li>
              <li><strong>PCD:</strong> ${product.pcd}</li>
              <li><strong>Цвет:</strong> ${product.color}</li>
              <li><strong>Вес:</strong> ${product.weight}</li>
              <li><strong>Производитель:</strong> ${product.manufacturer}</li>
            </ul>
          </div>
          <p>${product.description}</p>
          <button class="buy-button">Купить</button>
        </div>
    `;
}

export async function getProductById(id) {
    const products = await loadProducts();
    return products.find(p => p.id === parseInt(id));
}

export async function addProduct(productData) {
    const products = await loadProducts();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...productData
    };
    
    products.push(newProduct);
    await saveProducts(products);
    
    // Обновляем каталог на главной странице, если она открыта
    await updateCatalogIfOpen();
    
    return { success: true, product: newProduct };
}

export async function updateProduct(productId, productData) {
    const products = await loadProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(productId));
    if (productIndex === -1) {
        return { success: false, error: 'Товар не найден' };
    }
    
    products[productIndex] = { ...products[productIndex], ...productData };
    await saveProducts(products);
    
    // Обновляем каталог на главной странице, если она открыта
    await updateCatalogIfOpen();
    
    return { success: true, product: products[productIndex] };
}

export async function deleteProduct(productId) {
    const products = await loadProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(productId));
    if (productIndex === -1) {
        return { success: false, error: 'Товар не найден' };
    }
    
    products.splice(productIndex, 1);
    await saveProducts(products);
    
    await updateCatalogIfOpen();
    
    return { success: true };
}

// Функция для обновления каталога на главной странице
export async function updateCatalogIfOpen() {
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/') ||
        document.querySelector('.ob')) {
        
        const catalogContainer = document.querySelector('.ob');
        if (catalogContainer) {
            console.log('Обновление каталога на главной странице...');
            await renderProductList(catalogContainer);
        }
    }
}