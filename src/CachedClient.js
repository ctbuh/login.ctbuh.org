const RedisCache = require('./RedisCache');

const SCHEMA_CACHE_KEY_PREFIX = 'salesforce:schema_';
const SCHEMA_CACHE_TTL = 60 * 60;

let _client;
let _cache;

/**
 *
 * @param client
 * @param {RedisCache} cache
 * @constructor
 */
function CachedClient(client, cache) {
    _client = client;
    _cache = cache;
}


const cachedDescribe = async function (type) {

    return _cache.remember(SCHEMA_CACHE_KEY_PREFIX + type, SCHEMA_CACHE_TTL, function () {
        return _client.describe(type);
    });
}

const cachedGetFieldNames = async function (type) {

    let result = await cachedDescribe(type);

    let fields = [];

    for (let i = 0; i < result.fields.length; i++) {
        fields.push(result.fields[i].name);
    }

    return fields;
}

CachedClient.prototype.findContact = async function (contact_id) {

    let names = await cachedGetFieldNames('Contact');


    return _client.query('SELECT ' + names.join(','));

}
CachedClient.prototype.clearCache = function () {

}

module.exports = CachedClient;