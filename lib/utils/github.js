const fetch = require('cross-fetch');

// Github assigns specific code (?code=a0z25b1y24) to user
// Take this code and exchange for API token to use on behalf of the user
const exchangeCodeForToken = async (code) => {
    // 1) Exchange this code for an access token
    const resp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',

        // 2) Provide format of "application.json" in the Accept header
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        // 3) Pass in required code parameters: client_id, client_secret, code in the body
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
        }),
    });

    console.log('----RESP.JSON----', await resp.json());
    const { access_token } = await resp.json();
    console.log('-----ACCESS TOKEN-----', access_token);
    return access_token;
    
};

// Use the access token to access the Github API
const getUserProfile = async (token) => {
    const profileResp = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `token ${token}`,
        },
    });
    console.log('----profileResp----', await profileResp.json());
    const { avatar_url, login } = await profileResp.json();
    return { username: login, photoUrl: avatar_url };
}


module.exports = { exchangeCodeForToken, getUserProfile };
