// dependencies
const express = require('express');

const router = express.Router();
const Todo = require('../models/todoModel');
const User = require('../models/userModel');

// GET ALL THE TODOS
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();

        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET A TODO by ID
router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.find({ _id: req.params.id });
        res.status(200).send({
            result: data,
            msg: 'Success',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
});

// POST A TODO
router.post('/', async (req, res) => {
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

// PUT TODO
router.put('/:id', async (req, res) => {
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

// DELETE TODO
router.delete('/:id', async (req, res) => {
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
