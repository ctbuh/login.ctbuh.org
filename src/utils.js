const URL = require('url');
const querystring = require('querystring');

function urlWithoutPath(url) {

    if (typeof url !== 'string') {
        return null;
    }

    const url_parts = URL.parse(url);
    return url_parts['protocol'] + '//' + url_parts['host'];
}

function addHttps(url) {

    if (url.indexOf('http') !== 0) {
        return 'https://' + url;
    }

    return url;
}

function dateYearFromNow() {
    return new Date(Date.now() + (1000 * 60 * 60 * 24));
}

module.exports = {urlWithoutPath, addHttps, dateYearFromNow};