export async function getUsers() {
    try {
        const response = await fetch('./data/users.json');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const users = await response.json();
        console.log('Загружены пользователи из JSON:', users);
        return users;
    } catch (error) {
        console.error('Ошибка загрузки пользователей из JSON:', error);
        return getLocalUsers();
    }
}

export async function saveUsers(users) {
    try {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Пользователи сохранены в localStorage:', users);
        return true;
    } catch (error) {
        console.error('Ошибка сохранения пользователей:', error);
        return false;
    }
}

export async function getProducts() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const products = await response.json();
        console.log('Загружены товары из JSON:', products);
        return products;
    } catch (error) {
        console.error('Ошибка загрузки товаров из JSON:', error);
        return getLocalProducts();
    }
}

export async function saveProducts(products) {
    try {
        // Сохраняем в localStorage
        localStorage.setItem('products', JSON.stringify(products));
        console.log('Товары сохранены в localStorage:', products);
        return true;
    } catch (error) {
        console.error('Ошибка сохранения товаров:', error);
        return false;
    }
}

// Инициализация пользователей в localStorage при первой загрузке
export async function initializeUsers() {
    if (!localStorage.getItem('users')) {
        try {
            // Загружаем начальных пользователей из JSON
            const users = await getUsers();
            if (users && users.length > 0) {
                localStorage.setItem('users', JSON.stringify(users));
                console.log('Пользователи инициализированы в localStorage из JSON');
            } else {
                // Создаем базовых пользователей если JSON пуст
                const defaultUsers = [
                    {
                        "id": 1,
                        "login": "admin",
                        "password": "123456",
                        "name": "Админ",
                        "role": "admin"
                    },
                    {
                        "id": 2,
                        "login": "user",
                        "password": "password",
                        "name": "Пользователь",
                        "role": "user"
                    }
                ];
                localStorage.setItem('users', JSON.stringify(defaultUsers));
                console.log('Созданы пользователи по умолчанию');
            }
        } catch (error) {
            console.error('Ошибка инициализации пользователей:', error);
            // Создаем базовых пользователей при ошибке
            const defaultUsers = [
                {
                    "id": 1,
                    "login": "admin",
                    "password": "123456",
                    "name": "Админ",
                    "role": "admin"
                },
                {
                    "id": 2,
                    "login": "user",
                    "password": "password",
                    "name": "Пользователь",
                    "role": "user"
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
            console.log('Созданы пользователи по умолчанию из-за ошибки');
        }
    } else {
        console.log('Пользователи уже инициализированы в localStorage');
    }
}

// Инициализация товаров в localStorage при первой загрузке
export async function initializeProducts() {
    if (!localStorage.getItem('products')) {
        try {
            // Загружаем начальные товары из JSON
            const products = await getProducts();
            if (products && products.length > 0) {
                localStorage.setItem('products', JSON.stringify(products));
                console.log('Товары инициализированы в localStorage из JSON');
            }
        } catch (error) {
            console.error('Ошибка инициализации товаров:', error);
        }
    } else {
        console.log('Товары уже инициализированы в localStorage');
    }
}

export function getLocalUsers() {
    try {
        const users = localStorage.getItem('users');
        const parsedUsers = users ? JSON.parse(users) : [];
        console.log('Получены пользователи из localStorage:', parsedUsers);
        return parsedUsers;
    } catch (error) {
        console.error('Ошибка получения пользователей из localStorage:', error);
        return [];
    }
}

export function getLocalProducts() {
    try {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    } catch (error) {
        console.error('Ошибка получения товаров из localStorage:', error);
        return [];
    }
}

export function forceRefreshProducts() {
    localStorage.removeItem('products');
    console.log('Данные о товарах принудительно обновлены');
}