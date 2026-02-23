const dbService = require('../services/databaseService');

const onlineUsers = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('🔌 User connected:', socket.id);

        socket.on('login', (username) => {
            onlineUsers.set(username, socket.id);
            socket.username = username;
            io.emit('user-online', username);
            
            // Update status di database
            dbService.updateUserStatus(username, 'online');
        });

        socket.on('send-location', (data) => {
            const { username, lat, lng } = data;
            
            // Update database
            dbService.updateUserLocation(username, lat, lng);
            
            // Broadcast ke semua user lain
            socket.broadcast.emit('user-location', { username, lat, lng });
        });

        socket.on('send-message', (data) => {
            const { from, to, message } = data;
            
            // Simpan ke database
            dbService.saveMessage(from, to, message);
            
            // Kirim ke penerima kalo online
            const targetSocket = onlineUsers.get(to);
            if (targetSocket) {
                io.to(targetSocket).emit('new-message', {
                    from,
                    to,
                    message,
                    timestamp: new Date()
                });
            }
        });

        socket.on('broadcast', (data) => {
            socket.broadcast.emit('broadcast', data);
        });

        socket.on('disconnect', () => {
            if (socket.username) {
                onlineUsers.delete(socket.username);
                io.emit('user-offline', socket.username);
                dbService.updateUserStatus(socket.username, 'offline');
            }
        });
    });
};
