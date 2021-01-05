const redis = require("redis");
let _client;

function Redis() {
    _client = redis.createClient(6379);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

Redis.prototype.remember = function (key, expires, callback) {

    return new Promise(function (resolve, reject) {

        if (typeof key !== 'string') {
            return reject('Redis Cache Key must be a string! Received: ' + key);
        }

        _client.get(key, async function (err, reply) {

            if (err) {
                return reject(err);
            }

            if (reply) {
                console.log(key + ': Cache Hit!');

                let value = IsJsonString(reply) ? JSON.parse(reply) : reply;
                resolve(value);

            } else {
                console.log(key + ': Cache Miss...');

                let result;

                try {
                    result = await callback();
                } catch (ex) {
                    return reject(ex);
                }

                // if callback succeeds, but its value is undefined, do not cache it either
                if (typeof result === 'undefined') {
                    return reject('Cannot cache UNDEFINED');
                }

                let value = (typeof result === 'object') ? JSON.stringify(result) : result;

                _client.setex(key, expires, value, function (err, res) {

                    if (res) {
                        return resolve(result);
                    }

                    reject(err);
                });
            }
        });
    });
}

Redis.prototype.forget = async function (key) {

    return new Promise(function (resolve, reject) {

        _client.del(key, function (err, reply) {

            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    })
}

module.exports = Redis;