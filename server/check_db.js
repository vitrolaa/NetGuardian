const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function checkDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            multipleStatements: true
        });

        console.log('Connected to MySQL server.');

        // Check if database exists
        const [dbs] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME || 'netGuardian'}'`);
        if (dbs.length === 0) {
            console.log(`Database ${process.env.DB_NAME} does not exist. Creating...`);
            await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log('Database created.');
        } else {
            console.log(`Database ${process.env.DB_NAME} exists.`);
        }

        await connection.changeUser({ database: process.env.DB_NAME || 'netGuardian' });

        // Check tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]));

        if (tables.length === 0) {
            console.log('No tables found. executing database.sql...');
            const sqlPath = path.join(__dirname, '../../DATABASE/database.sql');
            if (fs.existsSync(sqlPath)) {
                const sql = fs.readFileSync(sqlPath, 'utf8');
                await connection.query(sql);
                console.log('database.sql executed successfully.');
            } else {
                console.error('database.sql not found at', sqlPath);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Database check failed:', error);
    }
}

checkDatabase();
