const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/balance', verifyToken, async (req, res) => {
    try {
        const username = req.user.sub;
        const [rows] = await db.query('SELECT balance FROM KodUser WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ balance: rows[0].balance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
