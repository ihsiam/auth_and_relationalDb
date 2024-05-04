const jwt = require('jsonwebtoken');

require('dotenv').config();

const auth = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { username, id } = decoded;
        req.username = username;
        req.id = id;
        next();
    } catch {
        next('Auth err');
    }
};

module.exports = auth;
