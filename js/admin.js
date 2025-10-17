import { getAllUsers, addUser, updateUser, deleteUser, isAdmin, logoutUser } from './auth.js';
import { loadProducts, addProduct, updateProduct, deleteProduct } from './products.js';
import { validateForm } from './validation.js';

import { initializeUsers, initializeProducts } from './mockDB.js';
initializeUsers();
initializeProducts();

document.addEventListener('DOMContentLoaded', function() {
    // Проверка прав администратора
    if (!isAdmin()) {
        alert('Доступ запрещен. Требуются права администратора.');
        window.location.href = 'index.html';
        return;
    }

    initializeAdminPanel();
});

function initializeAdminPanel() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            if (tabId === 'users') {
                loadUsersTable();
            } else if (tabId === 'products') {
                loadProductsTable();
            }
        });
    });

    loadUsersTable();
    loadProductsTable();

    initializeModals();

    document.getElementById('admin-logout').addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
        window.location.href = 'index.html';
    });
}

async function loadUsersTable() {
    try {
        const users = await getAllUsers();
        const tbody = document.getElementById('users-table-body');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Нет пользователей</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.login}</td>
                <td>${user.role}</td>
                <td class="admin-actions">
                    <button class="edit-btn" onclick="editUser(${user.id})">Редактировать</button>
                    <button class="delete-btn" onclick="deleteUserHandler(${user.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Ошибка загрузки данных</td></tr>';
    }
}

async function loadProductsTable() {
    try {
        const products = await loadProducts();
        const tbody = document.getElementById('products-table-body');
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Нет товаров</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>${product.price} ₽</td>
                <td>${product.manufacturer}</td>
                <td class="admin-actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})">Редактировать</button>
                    <button class="delete-btn" onclick="deleteProductHandler(${product.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Ошибка загрузки данных</td></tr>';
    }
}

function initializeModals() {
    const userModal = document.getElementById('user-modal');
    const addUserBtn = document.getElementById('add-user-btn');
    const userForm = document.getElementById('user-form');

    addUserBtn.addEventListener('click', () => {
        openUserModal();
    });

    userForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveUser();
    });

    const productModal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');

    addProductBtn.addEventListener('click', () => {
        openProductModal();
    });

    productForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveProduct();
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function openUserModal(userId = null) {
    const modal = document.getElementById('user-modal');
    const title = document.getElementById('user-modal-title');
    const form = document.getElementById('user-form');
    
    form.reset();
    
    if (userId) {
        getAllUsers().then(users => {
            const user = users.find(u => u.id === userId);
            if (user) {
                title.textContent = 'Редактировать пользователя';
                document.getElementById('user-id').value = user.id;
                document.getElementById('user-name').value = user.name;
                document.getElementById('user-login').value = user.login;
                document.getElementById('user-role').value = user.role;
                document.getElementById('user-password').required = false;
                document.getElementById('user-password').placeholder = 'Оставьте пустым, если не меняется';
            }
        });
    } else {
        title.textContent = 'Добавить пользователя';
        document.getElementById('user-id').value = '';
        document.getElementById('user-password').required = true;
        document.getElementById('user-password').placeholder = 'Пароль';
    }
    
    modal.style.display = 'block';
}

function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');
    
    form.reset();
    
    if (productId) {
        loadProducts().then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                title.textContent = 'Редактировать товар';
                document.getElementById('product-id').value = product.id;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-image').value = product.image;
                document.getElementById('product-material').value = product.material;
                document.getElementById('product-diameter').value = product.diameter;
                document.getElementById('product-width').value = product.width;
                document.getElementById('product-offset').value = product.offset;
                document.getElementById('product-pcd').value = product.pcd;
                document.getElementById('product-color').value = product.color;
                document.getElementById('product-weight').value = product.weight;
                document.getElementById('product-manufacturer').value = product.manufacturer;
            }
        });
    } else {
        title.textContent = 'Добавить товар';
        document.getElementById('product-id').value = '';
    }
    
    modal.style.display = 'block';
}

async function saveUser() {
    const userId = document.getElementById('user-id').value;
    const name = document.getElementById('user-name').value;
    const login = document.getElementById('user-login').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;

    if (!name || !login || !role) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    if (!userId && !password) {
        alert('Пожалуйста, введите пароль для нового пользователя');
        return;
    }

    const validation = validateForm(login, password, name);
    if (!validation.isValid && !userId) {
        alert('Пожалуйста, исправьте ошибки в форме');
        return;
    }

    const userData = { name, login, role };
    if (password) {
        userData.password = password;
    }

    try {
        let result;
        if (userId) {
            result = await updateUser(userId, userData);
        } else {
            result = await addUser(userData);
        }

        if (result.success) {
            document.getElementById('user-modal').style.display = 'none';
            await loadUsersTable();
            alert(userId ? 'Пользователь обновлен' : 'Пользователь добавлен');
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Ошибка сохранения пользователя:', error);
        alert('Произошла ошибка при сохранении пользователя');
    }
}

async function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseInt(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value;
    const material = document.getElementById('product-material').value;
    const diameter = document.getElementById('product-diameter').value;
    const width = document.getElementById('product-width').value;
    const offset = document.getElementById('product-offset').value;
    const pcd = document.getElementById('product-pcd').value;
    const color = document.getElementById('product-color').value;
    const weight = document.getElementById('product-weight').value;
    const manufacturer = document.getElementById('product-manufacturer').value;

    if (!name || !description || !price || !image) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert('Пожалуйста, введите корректную цену');
        return;
    }

    const productData = {
        name,
        description,
        price,
        image,
        material,
        diameter,
        width,
        offset,
        pcd,
        color,
        weight,
        manufacturer
    };

    try {
        let result;
        if (productId) {
            result = await updateProduct(productId, productData);
        } else {
            result = await addProduct(productData);
        }

        if (result.success) {
            document.getElementById('product-modal').style.display = 'none';
            await loadProductsTable();
            
            // Принудительно обновляем каталог на главной странице
            const { updateCatalogIfOpen } = await import('./products.js');
            await updateCatalogIfOpen();
            
            alert(productId ? 'Товар обновлен' : 'Товар добавлен');
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Ошибка сохранения товара:', error);
        alert('Произошла ошибка при сохранении товара');
    }
}

window.editUser = function(userId) {
    openUserModal(userId);
};

window.deleteUserHandler = async function(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        try {
            const result = await deleteUser(userId);
            if (result.success) {
                await loadUsersTable();
                alert('Пользователь удален');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
            alert('Произошла ошибка при удалении пользователя');
        }
    }
};

window.editProduct = function(productId) {
    openProductModal(productId);
};

window.deleteProductHandler = async function(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        try {
            const result = await deleteProduct(productId);
            if (result.success) {
                await loadProductsTable();
                
                // Принудительно обновляем каталог на главной странице
                const { updateCatalogIfOpen } = await import('./products.js');
                await updateCatalogIfOpen();
                
                alert('Товар удален');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            alert('Произошла ошибка при удалении товара');
        }
    }
};