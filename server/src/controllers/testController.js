const db = require('../config/db');

// List recent activity (Tests joined with Devices)
exports.getRecentActivity = async (req, res) => {
    try {
        const query = `
      SELECT 
        T.id, 
        T.status, 
        T.latency, 
        T.timestamp, 
        D.name as device_name, 
        D.type as device_type
      FROM TESTS T
      JOIN DEVICES D ON T.device_id = D.id
      ORDER BY T.timestamp DESC
      LIMIT 50
    `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const [totalDevices] = await db.query('SELECT COUNT(*) as count FROM DEVICES');
        // For online/offline, we need the latest status for each device.
        // This is a bit complex, so for now we'll just count based on the latest test for each device.
        // Or simpler: just count all tests? No, that's wrong.
        // Let's assume the Dashboard needs current status.
        // We can fetch the latest test for each device.

        const statusQuery = `
      SELECT T.status, COUNT(*) as count
      FROM TESTS T
      INNER JOIN (
          SELECT device_id, MAX(timestamp) as max_time
          FROM TESTS
          GROUP BY device_id
      ) Latest ON T.device_id = Latest.device_id AND T.timestamp = Latest.max_time
      GROUP BY T.status
    `;

        const [statusCounts] = await db.query(statusQuery);

        let stats = {
            total: totalDevices[0].count,
            online: 0,
            offline: 0,
            warning: 0
        };

        statusCounts.forEach(row => {
            if (row.status === 'ONLINE') stats.online = row.count;
            else if (row.status === 'OFFLINE') stats.offline = row.count;
            else if (row.status === 'TIMEOUT') stats.warning += row.count; // Treat timeout as warning or offline?
            else stats.warning += row.count;
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
