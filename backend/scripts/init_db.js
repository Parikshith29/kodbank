const db = require('../config/db');

async function initDB() {
    try {
        console.log('Connecting to database...');
        const connection = await db.getConnection();
        console.log('Connected successfully.');

        // Create KodUser table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS KodUser (
        uid INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 100000,
        phone VARCHAR(20),
        role ENUM('Customer', 'manager', 'admin') DEFAULT 'Customer'
      )
    `);
        console.log('KodUser table ready.');

        // Create UserToken table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS UserToken (
        tid INT AUTO_INCREMENT PRIMARY KEY,
        token TEXT NOT NULL,
        uid INT,
        expiry DATETIME NOT NULL,
        FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
      )
    `);
        console.log('UserToken table ready.');

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initDB();
