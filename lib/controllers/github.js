const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()

// GET /api/v1/github/login

// user is redirected to request his/her/they Github identity
.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`);
})

// GET /api/v1/github/login/callback
.get('/login/callback', async (req, res, next) => {
    try {
        // get code from query param and pass it to our service to create a user
        const user = await UserService.create(req.query.code);
        

        // set cookie and redirect
        
    } catch (error) {
        next(error)
    }
})