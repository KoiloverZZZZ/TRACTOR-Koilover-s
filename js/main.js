import { validateForm } from './validation.js';
import { loginUser } from './auth.js';
import { renderProductList, renderProductDetails } from './products.js';
import { products } from './mockDB.js';

// Для login.html
if (document.querySelector('.login-form')) {
  const form = document.querySelector('.login-form');
  const loginInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { isValid, loginError, passwordError } = validateForm(loginInput.value, passwordInput.value);
    
    if (!isValid) {
      alert(`${loginError || ''} ${passwordError || ''}`.trim());
      return;
    }
    
    const result = loginUser(loginInput.value, passwordInput.value);
    if (result.success) {
      alert('Вход успешен!');
      window.location.href = 'index.html';
    } else {
      alert(result.error);
    }
  });
}

// Для index.html
if (document.querySelector('.ob')) {
  const container = document.querySelector('.ob');
  renderProductList(container);
}

// Для products.html - отображение деталей товара
if (document.querySelector('.product-details')) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      const productDetails = document.querySelector('.product-details');
      productDetails.innerHTML = renderProductDetails(product);
    } else {
      document.querySelector('.product-details').innerHTML = '<p>Товар не найден</p>';
    }
  } else {
    document.querySelector('.product-details').innerHTML = '<p>ID товара не указан</p>';
  }
}