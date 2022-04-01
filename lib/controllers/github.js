const { Router } = require('express');

module.exports = Router()

// GET /api/v1/github/login

// user is redirected to request his/her/they Github identity
.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`);
})

// GET /api/v1/github/login/callback
.get('/login/callback', async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
})