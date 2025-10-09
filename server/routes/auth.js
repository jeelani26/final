const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json("User registered!");
    } catch (err) { res.status(500).json(err); }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).json("Invalid credentials");

        const validated = await bcrypt.compare(req.body.password, user.password);
        if (!validated) return res.status(400).json("Invalid credentials");

        const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey');
        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;