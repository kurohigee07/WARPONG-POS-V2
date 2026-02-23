const Message = {
    create: (from, to, messageText) => {
        return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            from,
            to,
            message: messageText,
            timestamp: new Date().toISOString(),
            isRead: false
        };
    }
};

module.exports = Message;
