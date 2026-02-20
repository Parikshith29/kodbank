const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const [existing] = await db.query('SELECT * FROM KodUser WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO KodUser (username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, phone, 'Customer', 100000]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM KodUser WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { sub: user.username, role: user.role, uid: user.uid },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store in DB
        await db.query('INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)', [token, user.uid, expiryDate]);

        // Send Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.json({ message: 'Login successful', username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
