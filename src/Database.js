const mysql = require('mysql');
require('./types');

let pool;

/**
 *
 * @param {DatabaseConfig} config
 * @constructor
 */
function Database(config) {

    pool = mysql.createPool({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database
    });
}

Database.prototype.getToken = async function (uid) {
    let result = await this.query("SELECT * FROM tokens WHERE id = ? AND revoked_at IS NULL", [uid]);
    return result.length ? result[0] : null;
}

Database.prototype.save = async function (uid, data) {

    let query = 'INSERT INTO tokens (id, created_at, user_id, access_token, refresh_token, ip_addr) VALUES (?, UTC_TIMESTAMP(), ?, ?, ?, ?) ';
    let params = [uid, data.userInfo.id, data.accessToken, data.refreshToken, data.ip];

    return this.query(query, params);
}

Database.prototype.updateAccessToken = async function (uid, token) {
    return this.query('UPDATE tokens SET access_token = ? WHERE uid = ? AND revoked_at IS NULL', [token, uid]);
}

Database.prototype.revoke = async function (uid) {
    return this.query('UPDATE tokens SET revoked_at = UTC_TIMESTAMP() WHERE id = ? AND revoked_at IS NULL', [uid]);
}

Database.prototype.query = async function (query, params) {

    return new Promise(function (resolve, reject) {

        pool.getConnection(async function (err, connection) {

            if (err) {
                connection.release();
                return reject(err);
            }

            connection.query(query, params, function (err, result, fields) {
                connection.release();

                if (err) {
                    return reject(err);
                }

                let json = JSON.parse(JSON.stringify(result));
                resolve(json);
            });

        });
    });
}

module.exports = Database;