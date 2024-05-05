// dependencies
const { model, Schema, default: mongoose } = require('mongoose');

// schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    todos: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Todo',
        },
    ],
});

// model
const User = model('User', userSchema);

// export
module.exports = User;
