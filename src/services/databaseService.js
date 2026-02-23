const { readDB, writeDB } = require('../config/database');
const UserModel = require('../models/User');
const MessageModel = require('../models/Message');

const dbService = {
    // User operations
    findUserByUsername: (username) => {
        const db = readDB();
        return db.users.find(u => u.username === username);
    },

    getAllUsers: () => {
        const db = readDB();
        return db.users.map(({ password, ...user }) => user);
    },

    createUser: (userData) => {
        const db = readDB();
        const newUser = UserModel.create(userData);
        db.users.push(newUser);
        if (writeDB(db)) {
            const { password, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        }
        return null;
    },

    updateUserStatus: (username, status) => {
        const db = readDB();
        const user = db.users.find(u => u.username === username);
        if (user) {
            user.status = status;
            user.lastSeen = new Date().toISOString();
            return writeDB(db);
        }
        return false;
    },

    updateUserLocation: (username, lat, lng) => {
        const db = readDB();
        const user = db.users.find(u => u.username === username);
        if (user) {
            user.location = { lat, lng };
            return writeDB(db);
        }
        return false;
    },

    // Message operations
    saveMessage: (from, to, messageText) => {
        const db = readDB();
        const newMessage = MessageModel.create(from, to, messageText);
        db.messages.push(newMessage);
        writeDB(db);
        return newMessage;
    },

    getMessagesBetweenUsers: (user1, user2, limit = 50) => {
        const db = readDB();
        return db.messages
            .filter(m => (m.from === user1 && m.to === user2) || (m.from === user2 && m.to === user1))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .slice(-limit);
    }
};

module.exports = dbService;
