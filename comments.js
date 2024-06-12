// create web server
// http://localhost:3000/comments

// import express
const express = require('express')
const app = express()

// import comment model
// what would the models/comment.js file look like using json and js?
const Comment = require('../models/comment')

// create a new comment
app.post('/comments', async (req, res) => {
    const comment = new Comment(req.body)
    try {
        await comment.save()
        res.status(201).send(comment)
    } catch (e) {
        res.status(400).send(e)
    }
})

// get all comments
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find({})
        res.send(comments)
    } catch (e) {
        res.status(500).send()
    }
})

// get a comment by id
app.get('/comments/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const comment = await Comment.findById(_id)
        if (!comment) {
            return res.status(404).send()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send()
    }
})

// update a comment by id
app.patch('/comments/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['content']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!comment) {
            return res.status(404).send()
        }
        res.send(comment)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete a comment by id
app.delete('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id)
        if (!comment) {
            return res.status(404).send()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send()
    }
})

// export the module
module.exports = app