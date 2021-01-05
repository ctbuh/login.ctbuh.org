const md5 = require('md5');

const {v4: uuidv4} = require('uuid');

function generateId(length) {

    length = length || 32;
    let prefix = undefined || '';
    let salt = undefined || '';

    let token = uuidv4(); // uses MAC address + timestamp
    token = md5(token + salt); // add our own salt
    token = (prefix + token).substring(0, length);

    return token;
}

module.exports = {generateId};