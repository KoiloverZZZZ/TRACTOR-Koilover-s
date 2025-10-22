import { renderProductList } from './products.js';
import { loginUser, registerUser, logoutUser, getCurrentUser, isAdmin } from './auth.js';
import { validateForm } from './validation.js';

document.addEventListener('DOMContentLoaded', async function() {
    const currentUser = getCurrentUser();
    updateHeader(currentUser);

    const catalogContainer = document.querySelector('.ob');
    if (catalogContainer) {
        await renderProductList(catalogContainer);
    }

    const loginForm = document.querySelector('.login-form');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const loginInput = this.querySelector('input[type="text"]');
            const passwordInput = this.querySelector('input[type="password"]');
            const login = loginInput.value;
            const password = passwordInput.value;
            
            console.log('Попытка входа:', login, password);
            
            const validation = validateForm(login, password);
            if (!validation.isValid) {
                alert('Пожалуйста, исправьте ошибки в форме');
                return;
            }

            try {
                const result = await loginUser(login, password);
                if (result.success) {
                    alert('Вход выполнен успешно!');
                    window.location.href = 'index.html';
                } else {
                    alert(result.error);
                    console.log('Ошибка входа. Проверьте логин и пароль.');
                    passwordInput.value = '';
                }
            } catch (error) {
                alert('Ошибка соединения с сервером');
            }
        });
    }

    const registerForm = document.querySelector('.login-form');
    if (registerForm && window.location.pathname.includes('register.html')) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nameInput = this.querySelector('input[placeholder="Имя"]');
            const loginInput = this.querySelector('input[placeholder="Логин"]');
            const passwordInput = this.querySelector('input[type="password"]');
            
            const name = nameInput.value;
            const login = loginInput.value;
            const password = passwordInput.value;
            
            console.log('Регистрация:', name, login, password);
            
            const validation = validateForm(login, password, name);
            if (!validation.isValid) {
                alert('Пожалуйста, исправьте ошибки в форме');
                return;
            }

            try {
                const result = await registerUser(login, password, name);
                if (result.success) {
                    alert('Регистрация выполнена успешно! Теперь вы можете войти в систему.');
                    window.location.href = 'login.html';
                } else {
                    alert(result.error);
                    loginInput.value = '';
                    passwordInput.value = '';
                }
            } catch (error) {
                alert('Ошибка соединения с сервером');
            }
        });
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
            window.location.href = 'index.html';
        });
    }

    if (window.location.pathname.includes('products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            try {
                const { getProductById, renderProductDetails } = await import('./products.js');
                const product = await getProductById(productId);
                const productContainer = document.querySelector('.product-details');
                if (product && productContainer) {
                    productContainer.innerHTML = renderProductDetails(product);
                    
                    const buyButton = productContainer.querySelector('.buy-button');
                    if (buyButton) {
                        buyButton.addEventListener('click', function() {
                            alert('Товар добавлен в корзину!');
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading product details:', error);
                const productContainer = document.querySelector('.product-details');
                if (productContainer) {
                    productContainer.innerHTML = '<p style="color: white; text-align: center;">Ошибка загрузки товара</p>';
                }
            }
        }
    }
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        const catalogContainer = document.querySelector('.ob');
        if (catalogContainer && (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/' || 
            window.location.pathname.endsWith('/'))) {
            
            setTimeout(async () => {
                await renderProductList(catalogContainer);
            }, 100);
        }
    }
});

function updateHeader(currentUser) {
    const userInfo = document.getElementById('user-info');
    const authLink = document.getElementById('auth-link');
    const logoutLink = document.getElementById('logout-link');
    const adminLink = document.getElementById('admin-link');

    if (currentUser) {
        if (userInfo) userInfo.textContent = `Привет, ${currentUser.name}`;
        if (authLink) authLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (adminLink && isAdmin()) {
            adminLink.style.display = 'inline';
        }
    } else {
        if (userInfo) userInfo.textContent = '';
        if (authLink) authLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}