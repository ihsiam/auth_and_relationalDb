// dependencies
const express = require('express');
const auth = require('../middlewares/auth');
const Todo = require('../models/todoModel');
const User = require('../models/userModel');

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();

        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get user TODO by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const data = await Todo.find({ user: req.params.id });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
});

// Post a todo
router.post('/', auth, async (req, res) => {
    try {
        // save todo
        const userId = req.id;
        const newTodo = new Todo({
            ...req.body,
            user: userId,
        });
        await newTodo.save();
        const { _id } = newTodo;

        // add todo id into user model
        await User.updateOne(
            { _id: userId },
            {
                $push: {
                    todos: _id,
                },
                // eslint-disable-next-line comma-dangle
            }
        );
        res.status(200).json({
            msg: 'uploaded',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
});

// Put todo
router.put('/:id', auth, async (req, res) => {
    try {
        // get the id
        const { id } = req.params;
        // get update data
        const updateData = req.body;
        // create a filter
        const filter = { _id: id };
        // upsert
        const options = { upsert: true };
        // set update data
        const updateDoc = {
            $set: { ...updateData },
        };
        // update on db
        const result = await Todo.updateOne(filter, updateDoc, options);
        // response send
        res.send(result);
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
    try {
        // delete from todo model
        const { id } = req.params;
        const userId = req.id;
        await Todo.deleteOne({ _id: id });

        // delete from user model
        await User.updateOne(
            { _id: userId },
            {
                $pull: {
                    todos: id,
                },
                // eslint-disable-next-line prettier/prettier
            },
        );

        res.status(200).json({
            msg: 'deleted',
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
});

// export
module.exports = router;
