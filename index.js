const app = require('./boot');

const TokenStorage = require('./src/TokenStorage');

const DatabaseConfig = require('./src/Config/db');
const Database = require('./src/Database');

const CallbackController = require('./src/controllers/CallbackController');

const CLIENT = require('./src/Client');
const SF_CONFIG = require('./src/Config/salesforce');

let client = new CLIENT(SF_CONFIG);

const RedisCache = require('./src/RedisCache');

const RANDOM = require('./src/Random');

const Redirector = require('./src/Redirector');

const utils = require('./src/utils');

app.get('/', async function (req, res) {

    res.redirect(302, '/home.html');
});

app.get('/test', function (req, res) {

    res.send(req.session);
});

app.get('/auth', function (req, res) {

    let url = client.getAuthUrl();
    res.send(url);
});

// whatever is in OAuth, will override this
app.get('/login/:code?', async function (req, res) {

    const referer = req.header('Referer');
    let next = req.query.next;

    if (!next || next === 'referer') {
        next = referer;
    }

    req.session.next = next;

    // const noAuth = req.query.noauth || false;

    const uid = req.cookies['sso_uid'];

    if (uid) {

        // yes, but is it valid?
        const info = await getTokenInfo(uid).catch(function (err) {
            //res.send('INVALID SESSION FOUND');
        });

        if (info) {
            let auth_url = Redirector.buildUrl(uid, next);

            res.send(auth_url);
            return;
        }
    }

    return res.redirect(302, '/auth');
});

app.get('/logout', async function (req, res) {

    const uid = req.cookies['sso_uid'];

    if (uid) {

        let ts = new TokenStorage(uid, new Database(DatabaseConfig));

        await ts.revoke().catch(() => {
            // do nothing
        })
    }

    res.redirect(302, '/');

});

app.get('/callback', async function (req, res) {

    const code = req.query.code;

    let info = await client.exchangeAuthCodeForToken(code)
        .catch(function (err) {

            res.send({
                message: 'Something went wrong when exchanging Auth Code for Token',
                exception: err.toString()
            });
        });

    console.log(info);

    if (info) {

        // log successful login!
        // console.log(info);

        let uid = RANDOM.generateId(16);

        let db = new Database(DatabaseConfig);
        let storage = new TokenStorage(uid, db);

        storage.store(info, getIp(req));

        res.cookie('sso_uid', uid, {
            'expires': utils.dateYearFromNow()
        });

        let next = req.session.next || '';

        res.redirect('/login?next=' + next);
        return;
    }

});

const getIp = function (req) {
    return req.ip;
}

const getTokenInfo = async function (uid) {

    let cache = new RedisCache();

    let storage = new TokenStorage(uid, new Database(DatabaseConfig));
    let client = new CLIENT(SF_CONFIG, storage);

    if (uid) {

        let cachedUserInfo = new (require('./src/CachedUserInfo'))(client, cache);
        return cachedUserInfo.getUserInfo();
    }

    return null;
}

app.get('/me', async function (req, res) {

    const uid = req.cookies['sso_uid'];

    await getTokenInfo(uid).then(function (info) {

        if (info) {
            res.send(info);
        } else {
            res.send({error: 'Not logged in'});
        }

    }).catch(function (err) {

        res.send({
            error: err.message
        });
    });

});

app.get('/info', async function (req, res) {

    const uid = req.query['sid'];
    //const token = req.params['token'];

    let info = await getTokenInfo(uid).catch(function (err) {
        res.send(err);
    });

    if (info) {
        res.send(info);
    } else {
        res.send({error: 'Not logged in'});
    }

})

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});

