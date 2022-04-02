const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getUserProfile } = require('../utils/github');

module.exports = class UserService {
    static async create(code) {
        // exchange code for token
        const token = await exchangeCodeForToken(code); 
        
        // get the user information from Github using the token
        const profile = await getUserProfile(token);
       
        // fetch (or create) a user in the database using the Github username)
        let user = await GithubUser.findByUsername(profile.username);
        if (!user) {
            user = await GithubUser.insert(profile);
        }
        return user;
    }
};
