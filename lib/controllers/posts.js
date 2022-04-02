const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
// POST /api/v1/posts
.post('/', authenticate, async (req, res, next) => {
    try {
        const post = await Post.insert({
            ...req.body,
            username: req.user.username
        });  
        res.send(post);
    } catch (error) {
        next(error);
    }
})

.get('/', authenticate, async (req, res) => {
    const post = await Post.getAll();
    res.send(post);
})
