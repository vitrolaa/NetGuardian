const ping = require('ping');
const db = require('../config/db.js');

exports.runPing = async (req, res) => {
    const { deviceId } = req.body;

    if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
    }

    try {
        // 1. Get device IP
        const [devices] = await db.query('SELECT * FROM DEVICES WHERE id = ?', [deviceId]);
        if (devices.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        const device = devices[0];

        // 2. Run ping
        const resPing = await ping.promise.probe(device.ip_address, {
            timeout: 2, // 2 seconds timeout
        });

        // 3. Determine status
        let status = 'OFFLINE';
        let latency = null;

        if (resPing.alive) {
            status = 'ONLINE';
            latency = Math.round(resPing.time); // time is in ms
        } else {
            // If not alive, it could be timeout or unreachable
            // For simplicity, we'll call it OFFLINE, or TIMEOUT if specifically detected
            // ping library returns alive: false for both.
            status = 'OFFLINE';
        }

        // 4. Save result to TESTS table
        await db.query(
            'INSERT INTO TESTS (device_id, status, latency) VALUES (?, ?, ?)',
            [deviceId, status, latency]
        );

        // 5. Update Device status cache (optional, but good for UI)
        // We might want to update the device's main status too?
        // Let's do it for consistency
        await db.query(
            'UPDATE DEVICES SET status = ? WHERE id = ?',
            [status === 'ONLINE' ? 'online' : 'offline', deviceId]
        );

        res.json({
            message: 'Ping test completed',
            result: {
                device: device.name,
                ip: device.ip_address,
                alive: resPing.alive,
                latency: latency,
                status: status
            }
        });

    } catch (error) {
        console.error('Ping error:', error);
        res.status(500).json({ error: error.message });
    }
};
