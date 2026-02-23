const dbService = require('../services/databaseService');

const messageController = {
    // GET /api/messages/:to
    getMessages: (req, res) => {
        const from = req.user.username;
        const { to } = req.params;

        const messages = dbService.getMessagesBetweenUsers(from, to);
        res.json({ success: true, messages });
    },

    // POST /api/messages (via socket, tapi kita bisa bikin endpoint cadangan)
    sendMessage: (req, res) => {
        const from = req.user.username;
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ success: false, message: 'Penerima dan pesan wajib diisi' });
        }

        const newMessage = dbService.saveMessage(from, to, message);
        res.status(201).json({ success: true, message: 'Pesan terkirim', data: newMessage });
    }
};

module.exports = messageController;
