/* eslint-disable prettier/prettier */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./middlewares/passport');
const userHandler = require('./handlers/userHandler');
const todoHandler = require('./handlers/TodoHandler');
const auth = require('./middlewares/auth');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Database connection with mongoose
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('Connection successful'))
    .catch((err) => console.error('MongoDB connection error:', err));

// CORS configuration
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // enable CORS with credentials
    }),
);

// Session middleware
app.use(
    session({
        secret: 'some_secret',
        resave: true,
        saveUninitialized: true,
    }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// google auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/admin/login' }),
    (req, res) => {
        res.redirect('http://localhost:5173/admin/uploadTodo'); // Redirect to the dashboard after successful login
    },
);

// get google user data
app.get('/google/data', auth, (req, res) => {
    // req.user contains the deserialized user object
    res.json(req.user);
});

// app routes
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// 404 page handle
app.use((req, res, next) => {
    res.send('Page not found');
    next();
});

// Server error handle
app.use((err, req, res, next) => {
    res.send(`Err: ${err}`);
    next(err);
});

// Server listening

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});
