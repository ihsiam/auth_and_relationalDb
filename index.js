const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./handlers/TodoHandler');
const userHandler = require('./handlers/userHandler');
require('dotenv').config();
const auth = require('./middlewares/auth');

// express app initialization
const app = express();
app.use(express.json());

// database connection with mongoose
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));

// application routes
app.use('/todo', auth, todoHandler);
app.use('/user', userHandler);

// 404 page handle
app.use((req, res, next) => {
    res.send('Page not found');
    next();
});

// Server error handle
app.use((err, req, res, next) => {
    res.send(err);
    next(err);
});

app.listen(3000, () => {
    console.log('app listening at port 3000');
});
