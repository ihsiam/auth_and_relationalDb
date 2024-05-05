// dependencies
const { model, Schema, default: mongoose } = require('mongoose');

// schema
const todoSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    des: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

// model
const Todo = model('Todo', todoSchema);

// export
module.exports = Todo;
