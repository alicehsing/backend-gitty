const { exchangeCodeForToken } = require('../utils/github');

module.exports = class UserService {
    static async create(code) {
        // exchange code for token
        const token = await exchangeCodeForToken(code); //token
        console.log('-----TOKEN-----',token);
    }
}