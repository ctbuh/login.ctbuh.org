// 5 minutes?
const INFO_CACHE_TTL = 60 * 60;

let _client;
let _cache;

/**
 *
 * @param {Client} client
 * @param cache
 * @constructor
 */
function CachedUserInfo(client, cache) {
    _client = client;
    _cache = cache;
}

const getUserInfo = async function () {

    let info = await _client.userInfo();

    let contact_id = info['custom_attributes']['Contact 18C ID'];

    let contactInfo = null;
    let accountInfo = null;

    try {

        await _client.retrieve('Contact', contact_id).then(data => {
            contactInfo = data;
        });

        // may not be associated with a company?
        if (contactInfo && 'AccountId' in contactInfo) {

            await _client.retrieve('Account', contactInfo['AccountId']).then(data => {
                accountInfo = data;
            });
        }

    } catch (ex) {
        // do nothing
    }

    // something must have went wrong? reject?
    if (!contactInfo) {
        return null;
    }

    return {
        userInfo: info,
        contact: contactInfo,
        account: accountInfo
    };
}

CachedUserInfo.prototype.getUserInfo = async function () {
    let at = await _client.getAccessToken();

    if (!at) {
        throw 'No Access Token found';
    }

    return _cache.remember(at, INFO_CACHE_TTL, getUserInfo);
}

module.exports = CachedUserInfo;