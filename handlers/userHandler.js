// dependencies
const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const saltRounds = 10;

// Sign up
router.post('/', async (req, res) => {
    // pass hashing
    const hashPass = await bcrypt.hash(req.body.pass, saltRounds);

    try {
        const user = new User({
            username: req.body.username,
            pass: hashPass,
        });
        await user.save();
        res.status(200).json({
            msg: 'User created',
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// log in
router.post('/login', async (req, res) => {
    try {
        const user = await User.find({ username: req.body.username });

        // auth
        if (user && user.length > 0) {
            const isValid = await bcrypt.compare(req.body.pass, user[0].pass);

            if (isValid) {
                // token generate
                const { username, _id } = user[0];
                const jwtObj = {
                    username,
                    id: _id,
                };
                const token = jwt.sign(jwtObj, process.env.JWT_SECRET, { expiresIn: '1hr' });

                res.status(200).send(token);
            } else {
                res.status(401).send('Auth err');
            }
        } else {
            res.status(401).send('Auth err');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// export
module.exports = router;
