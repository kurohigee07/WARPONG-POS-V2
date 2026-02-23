const bcrypt = require('bcryptjs');

const User = {
    create: (userData) => {
        return {
            id: Date.now().toString(),
            username: userData.username,
            password: bcrypt.hashSync(userData.password, 10),
            nama: userData.nama || userData.username,
            status: 'offline',
            location: { lat: -6.2088, lng: 106.8456 },
            isVip: false,
            avatar: `https://ui-avatars.com/api/?name=${userData.username}&background=1DB954&color=fff`,
            createdAt: new Date().toISOString(),
            lastSeen: new Date().toISOString()
        };
    }
};

module.exports = User;
