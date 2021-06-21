import {LoginSession} from "./Models/LoginSession";
import {Client} from "./Client";
import {SalesforceConnectionQuery} from "./lib/SalesforceConnectionQuery";
import {RedisCache} from "./lib/RedisCache";
import {Token} from "./Models/Token";
import {SessionRepository} from "./SessionRepository";

const force = new Client();

export const getCachedSessionInfo = async function (session: LoginSession, seconds: number) {

    const cacheKey = `session_${session.sid}`;

    return RedisCache.remember(cacheKey, seconds, async function () {
        return await getSessionInfo(session);
    });
}

export const getSessionInfo = async function (session: LoginSession): Promise<any> {

    const token: Token = session.getToken();

    let connection = force.getConnection(token, async function (newToken: string) {
        console.log('New Access Token: ' + newToken);
        await SessionRepository.updateAccessTokenForSession(session, newToken);
    });

    let identityInfo = await connection.identity();

    // fetch extra info specific to CTBUH
    const salesforceQuery = new SalesforceConnectionQuery(connection);

    let contact = {};
    let account = {};

    try {

        const contactId = identityInfo?.['custom_attributes']?.['Contact 18C ID'];
        contact = await salesforceQuery.findContact(contactId)

    } catch (ex) {
        // do nothing
    }

    return {
        identity: identityInfo,
        contact: contact,
        account: account
    }
}