import {LoginSession} from "./Models/LoginSession";
import {Client} from "./Client";
import {SalesforceConnectionQuery} from "./lib/SalesforceConnectionQuery";
import {RedisCache} from "./lib/RedisCache";
import {Token} from "./Models/Token";
import {SessionRepository} from "./SessionRepository";
import {Connection} from "jsforce";
import {Logger} from "./lib/Logger";

const forceClient = new Client();

function getSessionCacheKey(session: LoginSession) {
    return `session_${session.sid}`;
}

export const getCachedSessionInfo = async function (session: LoginSession, seconds: number) {

    const cacheKey = getSessionCacheKey(session);

    return RedisCache.remember(cacheKey, seconds, async function () {
        return await getSessionInfo(session);
    });
}

export const forgetSessionCache = async function (session: LoginSession): Promise<void> {
    await RedisCache.forget(getSessionCacheKey(session));
}

const freshConnection = function (session: LoginSession): Connection {

    const token: Token = session.getToken();

    return forceClient.getConnection(token, async function (newToken: string) {
        Logger.info('New Access Token: ' + newToken);
        await SessionRepository.updateAccessTokenForSession(session, newToken);
    });
}

// Will also refresh access token as a bonus!
export const pingSession = async function (session: LoginSession): Promise<boolean> {

    let con = freshConnection(session);

    try {
        await con.query('SELECT count() FROM User');
        return true;
    } catch (e) {
        return false;
    }
}

export const getSessionInfo = async function (session: LoginSession): Promise<any> {

    let connection = freshConnection(session);

    let identityInfo = await connection.identity();

    // fetch extra info specific to CTBUH
    const salesforceQuery = new SalesforceConnectionQuery(connection);

    let contact = {};
    let account = {};

    try {

        const contactId = identityInfo?.['custom_attributes']?.['Contact 18C ID'];
        contact = await salesforceQuery.findContact(contactId);

        if (contact && 'AccountId' in contact) {

            // @ts-ignore
            let accountId = contact['AccountId'] as string;

            account = await salesforceQuery.findAccount(accountId);
        }

    } catch (ex) {
        // do nothing
    }

    return {
        identity: identityInfo,
        contact: contact,
        account: account
    }
}