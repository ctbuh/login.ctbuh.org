const axios = require('axios');
const qs = require('qs');

/** @type SalesforceConfig */
let _config;
let client;

/**
 *
 * @param {SalesforceConfig} config
 * @constructor
 */
function Client(config) {

    _config = config;

    client = axios.create({
        baseURL: 'https://' + config.oauth_login_url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Authorization': 'Bearer ' + token
        }
    });
}

Client.prototype.introspect = async function (token) {

    return new Promise(function (resolve, reject) {

        client.post('/services/oauth2/introspect', qs.stringify({
            'client_id': _config.client_id,
            'client_secret': _config.client_secret,
            token: token,
          //  token_type_hint: 'refresh_token'
        }))
            .then(res => resolve(res.data))
            .catch(err => reject(err));

    });
}

// Token passed in better be valid and NOT expired!
Client.prototype.userInfo = async function (access_token) {

    return new Promise(function (resolve, reject) {

        client.post('/services/oauth2/userinfo', qs.stringify({
            access_token: access_token
        }))
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
}

module.exports = Client;