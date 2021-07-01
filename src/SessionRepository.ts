import {LoginSession} from "./Models/LoginSession";
import {Database} from "./Database";
import {UserInfoWithTokens} from "./Models/UserInfoWithTokens";
import {Security} from "./lib/Security";
import {CallbackRequest} from "./requests/CallbackRequest";

const db = new Database();

export type LoginSessionOrNull = LoginSession | null;

export class SessionRepository {

    // entirety of data that would be returned in JSON response
    static async findFromToken(token: string): Promise<LoginSession | null> {

        const result = await db.query('SELECT * FROM sessions WHERE token = ? AND deleted_at IS NULL', [token]);

        if (result.length) {
            const session = new LoginSession();
            Object.assign(session, result[0]);

            return session;
        }

        return null;
    }

    static async findFromSessionId(sid: string): Promise<LoginSession | null> {

        const result = await db.query('SELECT * FROM sessions WHERE sid = ? AND deleted_at IS NULL', [sid]);

        if (result.length) {
            const session = new LoginSession();
            Object.assign(session, result[0]);

            return session;
        }

        return null;
    }

    static async createSessionFromAuthResponse(response: UserInfoWithTokens, request: CallbackRequest): Promise<LoginSessionOrNull> {

        const sid = Security.getRandomSessionId();
        const token = Security.getRandomToken();

        const ua = request.userAgent().substr(0, 255);

        await db.query(`
                    INSERT INTO sessions (created_at, sid, token, user_id, access_token, refresh_token, user_agent, ip_addr)
                    VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?)`,
            [sid, token, response.userInfo.id, response.accessToken, response.refreshToken, ua, request.getIp()]);

        return this.findFromSessionId(sid);
    }

    static async updateAccessTokenForSession(session: LoginSession, accessToken: string): Promise<boolean> {
        await db.query('UPDATE sessions SET access_token = ?, last_refresh_at = NOW() WHERE id = ? LIMIT 1', [accessToken, session.id]);
        return true;
    }

    static async revoke(session: LoginSession): Promise<boolean> {
        await db.query('UPDATE sessions SET deleted_at = NOW() WHERE id = ?', [session.id]);
        return true;
    }

    static async ping(): Promise<boolean> {

        try {
            await db.query('SELECT COUNT(1) AS cnt FROM sessions');
            return true;
        } catch (ex) {
            return false;
        }
    }
}

