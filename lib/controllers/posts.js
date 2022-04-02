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
        console.log('---NEW POST---', post);
        res.send(post);
    } catch (error) {
        next(error);
    }
});
