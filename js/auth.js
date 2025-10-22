const API_BASE = 'http://localhost:3000/api';

export async function loginUser(login, password) {
    try {
        const response = await fetch(`${API_BASE}/users`);
        if (!response.ok) throw new Error('Network error');
        
        const users = await response.json();
        const user = users.find(u => u.login === login && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, error: 'Неверный логин или пароль' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
}

export async function registerUser(login, password, name) {
    try {
        const response = await fetch(`${API_BASE}/users`);
        if (!response.ok) throw new Error('Network error');
        
        const users = await response.json();
        
        if (users.find(u => u.login === login)) {
            return { success: false, error: 'Пользователь с таким логином уже существует' };
        }
        
        const newUser = { 
            login, 
            password, 
            name, 
            role: 'user' 
        };
        
        const createResponse = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
        });
        
        const result = await createResponse.json();
        
        if (result.success) {
            return { success: true, user: result.user };
        } else {
            return { success: false, error: result.error || 'Ошибка регистрации' };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
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
    try {
        const response = await fetch(`${API_BASE}/users`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Get users error:', error);
        throw new Error('Ошибка загрузки пользователей');
    }
}

export async function addUser(userData) {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        console.error('Add user error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
}

export async function updateUser(userId, userData) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        console.error('Update user error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
}

export async function deleteUser(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, error: 'Ошибка соединения с сервером' };
    }
}