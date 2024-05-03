const { model, Schema } = require('mongoose');

const todoSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    des: {
        type: String,
        required: true,
    },
});

const Todo = model('Todo', todoSchema);
module.exports = Todo;
