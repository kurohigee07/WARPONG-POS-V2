const dbService = require('../services/databaseService');

const locationController = {
    // POST /api/location
    updateLocation: (req, res) => {
        const { lat, lng } = req.body;
        const username = req.user.username;

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Latitude dan longitude wajib diisi' });
        }

        const updated = dbService.updateUserLocation(username, lat, lng);
        
        if (updated) {
            res.json({ success: true, message: 'Lokasi diperbarui' });
        } else {
            res.status(500).json({ success: false, message: 'Gagal memperbarui lokasi' });
        }
    }
};

module.exports = locationController;
