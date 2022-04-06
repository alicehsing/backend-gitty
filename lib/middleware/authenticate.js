const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
    try {
        // take session cookie off of request
        const cookie = req.cookies[process.env.COOKIE_NAME];

        // check session cookie is signed by user
        const user = verify(cookie);

        // attach user to request
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}