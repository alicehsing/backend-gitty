const User = require('../models/User');
const { exchangeCodeForToken, getUserProfile } = require('../utils/github');

module.exports = class UserService {
    static async create(code) {
        // exchange code for token
        const token = await exchangeCodeForToken(code); //token
        console.log('-----TOKEN-----',token);

        // get the user information from Github using the token
        const profile = await getUserProfile(token);
        console.log('----PROFILE----', profile);

        // fetch (or create) a user in the database using the Github username)
        let user = await User.findByUsername(profile.username);
        if (!user) {
            user = await User.insert(profile);
        }

        return user;
    }
};
