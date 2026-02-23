const dbService = require('../services/databaseService');

const userController = {
    // GET /api/users
    getAllUsers: (req, res) => {
        const users = dbService.getAllUsers();
        res.json({ success: true, users });
    },

    // GET /api/users/:username
    getUserByUsername: (req, res) => {
        const { username } = req.params;
        const user = dbService.findUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
        
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    }
};

module.exports = userController;
