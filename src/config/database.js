// src/config/database.js
const fs = require('fs');
const path = require('path');

// Tentukan path file database JSON
// Di environment production (seperti Render/Railway), kita pake folder /tmp biar bisa write
const isProduction = process.env.NODE_ENV === 'production';
const DB_FOLDER = isProduction ? '/tmp' : __dirname + '/../../data';
const DB_PATH = path.join(DB_FOLDER, 'db.json');

// Buat folder kalo belum ada (terutama penting untuk development)
if (!fs.existsSync(DB_FOLDER)) {
    fs.mkdirSync(DB_FOLDER, { recursive: true });
}

// Inisialisasi database kalo file belum ada
const initializeDatabase = () => {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = {
            users: [],
            messages: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
        console.log('✅ Database file created at:', DB_PATH);
    }
};

// Fungsi untuk membaca database
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error reading database:', error);
        return { users: [], messages: [] };
    }
};

// Fungsi untuk menulis database
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error writing database:', error);
        return false;
    }
};

// Inisialisasi di awal
initializeDatabase();

module.exports = { readDB, writeDB };
