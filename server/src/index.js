const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const deviceController = require('./controllers/deviceController');
const testController = require('./controllers/testController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ status: 'ok', message: 'Connected to database' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
    }
});

// Device Routes
app.get('/api/devices', deviceController.getAllDevices);
app.get('/api/devices/:id', deviceController.getDeviceById);
app.post('/api/devices', deviceController.createDevice);
app.put('/api/devices/:id', deviceController.updateDevice);
app.delete('/api/devices/:id', deviceController.deleteDevice);

// Dashboard Routes
app.get('/api/dashboard/activity', testController.getRecentActivity);
app.get('/api/dashboard/stats', testController.getDashboardStats);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
