import {LoginSession} from "./Models/LoginSession";
import {Database} from "./Database";
import {UserInfoWithTokens} from "./Models/UserInfoWithTokens";
import {Security} from "./lib/Security";

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

    static async createSessionFromAuthResponse(response: UserInfoWithTokens): Promise<LoginSessionOrNull> {

        const sid = Security.getRandomSessionId();
        const token = Security.getRandomToken();

        let result = await db.query('INSERT INTO sessions (created_at, sid, token, user_id, access_token, refresh_token) VALUES (NOW(), ?, ?, ?, ?, ?)', [
            sid, token, response.userInfo.id, response.accessToken, response.refreshToken
        ]);

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
}

