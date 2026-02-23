// src/controllers/authController.js
const dbService = require('../services/databaseService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-default-kalian-ganti-yah';

const authController = {
    // POST /api/register
    register: async (req, res) => {
        try {
            const { username, password, nama } = req.body;

            // Validasi input sederhana
            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
            }

            // Cek apakah user sudah ada
            const existingUser = dbService.findUserByUsername(username);
            if (existingUser) {
                return res.status(409).json({ success: false, message: 'Username sudah digunakan' });
            }

            // Buat user baru
            const newUser = dbService.createUser({ username, password, nama });
            if (newUser) {
                res.status(201).json({ success: true, message: 'Registrasi berhasil', user: newUser });
            } else {
                res.status(500).json({ success: false, message: 'Gagal menyimpan user' });
            }
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
        }
    },

    // POST /api/login
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
            }

            const user = dbService.findUserByUsername(username);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Username atau password salah' });
            }

            const isValidPassword = bcrypt.compareSync(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ success: false, message: 'Username atau password salah' });
            }

            // Update status user
            dbService.updateUserStatus(username, 'online');

            // Buat token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Kirim data user tanpa password
            const { password: _, ...userWithoutPassword } = user;
            res.json({
                success: true,
                message: 'Login berhasil',
                token,
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
        }
    },

    // POST /api/logout (opsional, untuk update status)
    logout: (req, res) => {
        const username = req.user?.username;
        if (username) {
            dbService.updateUserStatus(username, 'offline');
        }
        res.json({ success: true, message: 'Logout berhasil' });
    }
};

module.exports = authController;
