const DATABASE = require('./Database');

let _user_id;
let _database;

/**
 * @param user_id
 * @param {DATABASE} database
 * @constructor
 */
// unique storage per person!
function TokenStorage(user_id, database) {
    _database = database;
    _user_id = user_id;
}

TokenStorage.prototype.get = function () {
    return _database.getToken(_user_id)
}

TokenStorage.prototype.store = function (data, ip) {

    let combined = {...data, ...{ip: ip}};

    return _database.save(_user_id, combined);
}

TokenStorage.prototype.updateAccessToken = function (token) {
    return _database.updateAccessToken(_user_id, token);
}

TokenStorage.prototype.revoke = async function () {
    return _database.revoke(_user_id);
}

module.exports = TokenStorage;
