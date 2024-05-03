const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Home page get method');
});

app.listen(3000, () => {
    console.log('Server started');
});
