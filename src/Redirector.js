const AppConfig = require('./Config/app');
const utils = require('./utils');

function buildUrl(token, next) {

    let redirect_to = next || utils.addHttps(AppConfig.default_domain)
    let redirect_domain = utils.urlWithoutPath(redirect_to);

    if (next) {
        return redirect_domain + '/sso_auth?code=' + token + '&next=' + next;
    }

    return redirect_domain + '/sso_auth?code=' + token;
}

module.exports = {buildUrl};