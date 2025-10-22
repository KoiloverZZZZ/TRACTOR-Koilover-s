const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

async function ensureDataDirectory() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        console.log('Data directory created');
    } catch (error) {
        console.log('Data directory already exists');
    }
}

async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        return false;
    }
}

// Инициализация данных при запуске
async function initializeData() {
    await ensureDataDirectory();
    
    try {
        await fs.access(USERS_FILE);
        console.log('users.json exists');
    } catch (error) {
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
        await writeJSONFile(USERS_FILE, defaultUsers);
        console.log('Created default users.json');
    }
    
    try {
        await fs.access(PRODUCTS_FILE);
        console.log('products.json exists');
    } catch (error) {
        const defaultProducts = [
            {
                "id": 1,
                "name": "Weds Kranze",
                "description": "Премиальные литые диски Weds Kranze сочетают в себе японское качество и современный дизайн.",
                "price": 5000,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel1.png",
                "material": "Алюминиевый сплав",
                "diameter": "18\"",
                "width": "8.5J",
                "offset": "ET35",
                "pcd": "5x114.3",
                "color": "Серебристый",
                "weight": "9.2 кг",
                "manufacturer": "Weds Japan"
            },
            {
                "id": 2,
                "name": "Enkei RPF1",
                "description": "Легендарные легкие кованые диски для гонок и тюнинга. Иконка автоспорта.",
                "price": 15000,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel2.png",
                "material": "Кованый алюминий",
                "diameter": "17\"",
                "width": "9J",
                "offset": "ET22",
                "pcd": "5x114.3",
                "color": "Серебристый матовый",
                "weight": "7.1 кг",
                "manufacturer": "Enkei Japan"
            },
            {
                "id": 3,
                "name": "Emotion ZR7",
                "description": "Литые диски с агрессивным современным дизайном, часто в стиле \"гребного винта\".",
                "price": 2500,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel3.png",
                "material": "Алюминиевый сплав",
                "diameter": "19\"",
                "width": "9.5J",
                "offset": "ET30",
                "pcd": "5x112",
                "color": "Черный матовый",
                "weight": "11.5 кг",
                "manufacturer": "Emotion Wheels"
            },
            {
                "id": 4,
                "name": "BBS RI-D",
                "description": "Элитные ультралегкие кованые диски от BBS. Технология и цена высшего уровня.",
                "price": 8000,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel4.png",
                "material": "Кованый алюминий",
                "diameter": "20\"",
                "width": "10J",
                "offset": "ET25",
                "pcd": "5x120",
                "color": "Бронзовый",
                "weight": "8.8 кг",
                "manufacturer": "BBS Germany"
            },
            {
                "id": 5,
                "name": "Advance Racing RG-2",
                "description": "Японские литые диски в стиле \"гребного винта\", популярны в дрифте и стрит-культуре.",
                "price": 20000,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel5.png",
                "material": "Алюминиевый сплав",
                "diameter": "18\"",
                "width": "9J",
                "offset": "ET15",
                "pcd": "5x114.3",
                "color": "Белый",
                "weight": "10.3 кг",
                "manufacturer": "Advance Japan"
            },
            {
                "id": 6,
                "name": "BRIXTON FF10",
                "description": "Бюджетные литые диски с дизайном, напоминающим популярные модели (как RAYS TE37).",
                "price": 3500,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel6.png",
                "material": "Алюминиевый сплав",
                "diameter": "17\"",
                "width": "8J",
                "offset": "ET35",
                "pcd": "5x100",
                "color": "Серый матовый",
                "weight": "8.9 кг",
                "manufacturer": "Brixton Wheels"
            },
            {
                "id": 7,
                "name": "HRE P101",
                "description": "Роскошные полностью кованые 3-х компонентные диски. Эксклюзивный дизайн и высочайшее качество.",
                "price": 5000,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel7.png",
                "material": "Кованый алюминий",
                "diameter": "21\"",
                "width": "10.5J",
                "offset": "ET20",
                "pcd": "5x112",
                "color": "Темно-серый",
                "weight": "12.1 кг",
                "manufacturer": "HRE USA"
            },
            {
                "id": 8,
                "name": "BBS LM",
                "description": "Классические 2-х компонентные литые диски с полнопроходными спицами. Икона стиля для многих автомобилей.",
                "price": 5000,
                "image": "https://irepaotouogkzobmwuno.supabase.co/storage/v1/object/public/koilover/wheel8.png",
                "material": "Алюминиевый сплав",
                "diameter": "19\"",
                "width": "9J",
                "offset": "ET40",
                "pcd": "5x112",
                "color": "Золотой",
                "weight": "11.2 кг",
                "manufacturer": "BBS Germany"
            }
        ];
        await writeJSONFile(PRODUCTS_FILE, defaultProducts);
        console.log('Created default products.json with 8 products');
    }
}

app.get('/api/users', async (req, res) => {
    try {
        const users = await readJSONFile(USERS_FILE);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read users' });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const users = await readJSONFile(USERS_FILE);
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...req.body
        };
        users.push(newUser);
        
        if (await writeJSONFile(USERS_FILE, users)) {
            res.json({ success: true, user: newUser });
        } else {
            res.status(500).json({ error: 'Failed to save user' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const users = await readJSONFile(USERS_FILE);
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        users[userIndex] = { ...users[userIndex], ...req.body };
        
        if (await writeJSONFile(USERS_FILE, users)) {
            res.json({ success: true, user: users[userIndex] });
        } else {
            res.status(500).json({ error: 'Failed to update user' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const users = await readJSONFile(USERS_FILE);
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        users.splice(userIndex, 1);
        
        if (await writeJSONFile(USERS_FILE, users)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await readJSONFile(PRODUCTS_FILE);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read products' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const products = await readJSONFile(PRODUCTS_FILE);
        const productId = parseInt(req.params.id);
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read product' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const products = await readJSONFile(PRODUCTS_FILE);
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            ...req.body
        };
        products.push(newProduct);
        
        if (await writeJSONFile(PRODUCTS_FILE, products)) {
            res.json({ success: true, product: newProduct });
        } else {
            res.status(500).json({ error: 'Failed to save product' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const products = await readJSONFile(PRODUCTS_FILE);
        const productId = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        products[productIndex] = { ...products[productIndex], ...req.body };
        
        if (await writeJSONFile(PRODUCTS_FILE, products)) {
            res.json({ success: true, product: products[productIndex] });
        } else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const products = await readJSONFile(PRODUCTS_FILE);
        const productId = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        products.splice(productIndex, 1);
        
        if (await writeJSONFile(PRODUCTS_FILE, products)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/products.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

// Запуск сервера
initializeData().then(() => {
    app.listen(PORT, () => {
        console.log('=================================');
        console.log('🚗 TRACTOR Wheels Store Server');
        console.log('=================================');
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('');
        console.log('📊 API endpoints:');
        console.log('  GET    /api/users');
        console.log('  POST   /api/users');
        console.log('  PUT    /api/users/:id');
        console.log('  DELETE /api/users/:id');
        console.log('  GET    /api/products');
        console.log('  GET    /api/products/:id');
        console.log('  POST   /api/products');
        console.log('  PUT    /api/products/:id');
        console.log('  DELETE /api/products/:id');
        console.log('');
        console.log('🔑 Default admin login:');
        console.log('  Login: admin');
        console.log('  Password: 123456');
        console.log('');
        console.log('🛒 Available products: 8 wheels');
        console.log('=================================');
    });
}).catch(error => {
    console.error('Failed to initialize server:', error);
});