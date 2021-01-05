require('dotenv').config();

const obj = {
    client_id: process.env.SALESFORCE_OAUTH_CONSUMER_KEY,
    client_secret: process.env.SALESFORCE_OAUTH_CONSUMER_SECRET,

    oauth_login_url: process.env.SALESFORCE_OAUTH_DOMAIN,
    oauth_redirect_uri: process.env.SALESFORCE_OAUTH_REDIRECT_URI,

    api_username: process.env.SALESFORCE_API_USERNAME,
    api_password: process.env.SALESFORCE_API_PASSWORD,
    api_security_token: process.env.SALESFORCE_API_SECURITY_TOKEN
};

module.exports = obj;