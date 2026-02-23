const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Import Socket Handler
const socketHandler = require('./socket');

// Import Middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - PASTIKAN SEMUA UDAH DI-REGISTER
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO
socketHandler(io);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API WARPONG-POS Re-engineered',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth (login, register, logout)',
            users: '/api/users',
            location: '/api/location',
            messages: '/api/messages/:to'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use(errorHandler);

module.exports = { app, server, io };
