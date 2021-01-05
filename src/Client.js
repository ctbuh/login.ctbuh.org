const jsforce = require('jsforce');

// for type hinting
require('./types');
const TokenStorage = require('./TokenStorage');
const TokenClient = require('./TokenClient');

/** @type SalesforceConfig */
let _config;

let _oauth2;
let _conn;
let _storage;
let _tokenClient;

/**
 *
 * @constructor
 * @param {SalesforceConfig} config - another
 * @param {TokenStorage} storage - something
 */
function Client(config, storage) {

    _config = config;

    _oauth2 = new jsforce.OAuth2({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://' + config.oauth_login_url,
        // loginUrl: 'https://login.salesforce.com',
        clientId: config.client_id,
        clientSecret: config.client_secret,
        redirectUri: config.oauth_redirect_uri
    });

    _conn = new jsforce.Connection({
        oauth2: _oauth2
    });

    _storage = storage;
    _tokenClient = new TokenClient(_config);
}

Client.prototype.getAuthUrl = function () {

    return _oauth2.getAuthorizationUrl({
        response_type: 'code',
        scope: 'openid api refresh_token'
    });
}

Client.prototype.exchangeAuthCodeForToken = function (code) {

    return new Promise(function (resolve, reject) {

        _conn.authorize(code, function (err, userInfo) {

            if (err) {
                reject(err);
            }

            let obj = {
                instanceUrl: _conn.instanceUrl,
                accessToken: _conn.accessToken,
                refreshToken: _conn.refreshToken,
                userInfo: userInfo
            }

            resolve(obj);
        });

    });
}

async function freshConnection() {

    let token = await _storage.get();

    let connection = new jsforce.Connection({
        oauth2: _oauth2,
        // should be parsed from TOKEN. Defaults to: login.salesforce.com
        instanceUrl: 'https://' + _config.oauth_login_url,
        accessToken: token.access_token,
        refreshToken: token.refresh_token
    });

    connection.on("refresh", async function (accessToken, res) {

        console.log('Refreshing Access Token: ' + accessToken);

        return await _storage.updateAccessToken(accessToken);
    });

    return connection;
}

Client.prototype.retrieve = async function (type, id) {

    const conn = await freshConnection();

    return conn.sobject(type).retrieve(id);
}

Client.prototype.query = async function (query) {

    return new Promise(function (resolve, reject) {

        if (!_storage) {
            return reject('Invalid Storage');
        }

        freshConnection()
            .then(function (conn) {

                conn.query(query)
                    .then(result => resolve(result))
                    .catch(err => reject(err));

            }).catch(err => reject(err));

    });
}

// Run some dummy query for the whole purpose of triggering a refresh of access token if needed
Client.prototype.ping = async function () {
    return this.query('SELECT count() FROM User');
}

Client.prototype.freshConnection = freshConnection;

Client.prototype.getAccessToken = async function () {
    let token = await _storage.get();
    return token ? token.access_token : null;
}

Client.prototype.userInfo = async function () {

    const oThis = this;

    let token = await _storage.get();

    return new Promise(function (resolve, reject) {

        _tokenClient.userInfo(token.access_token)
            .then(function (res) {
                resolve(res);
            })
            .catch(async function (err) {

                let message = err.response.data;

                // Missing_OAuth_Token
                if (!message.includes('Bad_OAuth_Token')) {
                    return reject(err);
                }

                // retry! This will refresh and store new token
                try {
                    await oThis.ping();
                } catch (ex) {
                    return reject('Failed to acquire valid Access Token: ' + ex.message);
                }

                token = await _storage.get();

                await _tokenClient.userInfo(token.access_token)
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            });
    });
}

module.exports = Client;