const db = require('../config/db');

// List all devices
exports.getAllDevices = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DEVICES ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get device by ID
exports.getDeviceById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DEVICES WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Device not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new device
exports.createDevice = async (req, res) => {
    const { name, ip_address, type } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO DEVICES (name, ip_address, type) VALUES (?, ?, ?)',
            [name, ip_address, type]
        );
        res.status(201).json({ id: result.insertId, name, ip_address, type });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// Update device
exports.updateDevice = async (req, res) => {
    const { name, ip_address, type } = req.body;
    try {
        await db.query(
            'UPDATE DEVICES SET name = ?, ip_address = ?, type = ? WHERE id = ?',
            [name, ip_address, type, req.params.id]
        );
        res.json({ message: 'Device updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete device
exports.deleteDevice = async (req, res) => {
    try {
        await db.query('DELETE FROM DEVICES WHERE id = ?', [req.params.id]);
        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
