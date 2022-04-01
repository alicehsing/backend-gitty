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
    const { access_token } = await resp.json();
    console.log('-----TOKEN-----', access_token);
    return access_token;
    
};



module.exports = { exchangeCodeForToken };
