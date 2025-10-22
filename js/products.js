const API_BASE = 'http://localhost:3000/api';

export async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Load products error:', error);
        throw new Error('Ошибка загрузки товаров');
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
    try {
        const products = await loadProducts();
        container.innerHTML = products.map(renderProductCard).join('');
        
        container.querySelectorAll('.f').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.id;
                window.location.href = `products.html?id=${productId}`;
            });
        });
    } catch (error) {
        console.error('Error rendering product list:', error);
        container.innerHTML = '<p style="color: white; text-align: center;">Ошибка загрузки товаров</p>';
    }
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
    try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Get product by id error:', error);
        throw new Error('Ошибка загрузки товара');
    }
}

export async function addProduct(productData) {
    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        return await response.json();
    } catch (error) {
        console.error('Add product error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
}

export async function updateProduct(productId, productData) {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        return await response.json();
    } catch (error) {
        console.error('Update product error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
}

export async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Delete product error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
}

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