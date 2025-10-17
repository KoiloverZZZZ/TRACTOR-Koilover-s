import { getUsers, saveUsers, getLocalUsers } from "./mockDB.js"

export async function loginUser(login, password) {
    // Используем пользователей из localStorage, а не из JSON
    const users = getLocalUsers();
    console.log('Поиск пользователя:', login);
    console.log('Все пользователи в localStorage:', users);
    
    const user = users.find(u => u.login === login && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, error: 'Неверный логин или пароль' };
}

export async function registerUser(login, password, name) {
    // Используем пользователей из localStorage
    const users = getLocalUsers();
    console.log('Регистрация пользователя:', login);
    console.log('Текущие пользователи:', users);
    
    // Проверяем, существует ли пользователь с таким логином
    if (users.find(u => u.login === login)) {
        return { success: false, error: 'Пользователь с таким логином уже существует' };
    }
    
    // Создаем нового пользователя
    const newUser = { 
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, 
        login, 
        password, 
        name, 
        role: 'user' 
    };
    
    // Добавляем пользователя в базу данных
    users.push(newUser);
    await saveUsers(users);
    
    console.log('Новый пользователь зарегистрирован:', newUser);
    
    return { success: true, user: newUser };
}

export function logoutUser() {
    localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

export function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

export async function getAllUsers() {
    return getLocalUsers();
}

export async function addUser(userData) {
    const users = getLocalUsers();
    if (users.find(u => u.login === userData.login)) {
        return { success: false, error: 'Пользователь с таким логином уже существует' };
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData
    };
    
    users.push(newUser);
    await saveUsers(users);
    return { success: true, user: newUser };
}

export async function updateUser(userId, userData) {
    const users = getLocalUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(userId));
    if (userIndex === -1) {
        return { success: false, error: 'Пользователь не найден' };
    }
    
    // Проверяем, не занят ли логин другим пользователем
    const existingUser = users.find(u => u.login === userData.login && u.id !== parseInt(userId));
    if (existingUser) {
        return { success: false, error: 'Пользователь с таким логином уже существует' };
    }
    
    users[userIndex] = { ...users[userIndex], ...userData };
    await saveUsers(users);
    return { success: true, user: users[userIndex] };
}

export async function deleteUser(userId) {
    const users = getLocalUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(userId));
    if (userIndex === -1) {
        return { success: false, error: 'Пользователь не найден' };
    }
    
    // Не позволяем удалить самого себя
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === parseInt(userId)) {
        return { success: false, error: 'Нельзя удалить самого себя' };
    }
    
    users.splice(userIndex, 1);
    await saveUsers(users);
    return { success: true };
}