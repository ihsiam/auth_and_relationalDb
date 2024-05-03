const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./handlers/TodoHandler');
require('dotenv').config();

// express app initialization
const app = express();
app.use(express.json());

// database connection with mongoose
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));

// application routes
app.use('/todo', todoHandler);

// 404 page handle
app.use((req, res, next) => {
    res.send('Page not found');
});

// Server error handle
app.use((err, req, res, next) => {
    res.send('Server error');
    console.log(err);
});

app.listen(3000, () => {
    console.log('app listening at port 3000');
});
