const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
// POST /api/v1/posts
.post('/', authenticate, (req, res, next) => {
    Post.insert({
        ...req.body,
        username: req.user.username,
    })
    .then((post) => res.send(post))
    .catch((error) => next(error))

    // try {
    //     const post = await Post.insert({
    //         ...req.body,
    //         username: req.user.username
    //     });  
    //     res.send(post);
    // } catch (error) {
    //     next(error);
    // }
})

.get('/', authenticate, (req, res) => {
    Post.getAll().then((post) => res.send(post))
    // const post = await Post.getAll();
    // res.send(post);
})
