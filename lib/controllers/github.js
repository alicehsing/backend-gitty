const { Router } = require('express');
const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()

// GET /api/v1/github/login
// user is redirected to request his/her/they Github identity
.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`);
})

// GET /api/v1/github/login/callback
.get('/login/callback', (req, res, next) => {
    
        // get code from query param and pass it to our service to create a user
        UserService.create(req.query.code)
        .then((user) => jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1 day' }))
        // set cookie and redirect
        .then((payload) => res.cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
        }).redirect('/api/v1/posts'))
        .catch((error) => next(error));
    })

// .get('/login/callback', async (req, res, next) => {
//     try {
//         // get code from query param and pass it to our service to create a user
//         const user = await UserService.create(req.query.code);

//         const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1 day' });
        
//         // set cookie and redirect
//         res.cookie(process.env.COOKIE_NAME, payload, {
//             httpOnly: true,
//             maxAge: ONE_DAY_IN_MS,
//         })
//         .redirect('/api/v1/posts');
        
//     } catch (error) {
//         next(error)
//     }
// })

.delete('/', (req, res) => {
        res.clearCookie(process.env.COOKIE_NAME)
        .json({ success: true, message: 'Signed out successfully' });
})
