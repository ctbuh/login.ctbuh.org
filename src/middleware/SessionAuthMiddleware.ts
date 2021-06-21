import {NextFunction, Request, Response} from "express";
import {LoginSessionOrNull, SessionRepository} from "../SessionRepository";

export const SessionAuthMiddleware = async function (req: Request, res: Response, next: NextFunction) {

    const sid = req.cookies['sso_sid'];

    if (sid) {

        try {
            const session: LoginSessionOrNull = await SessionRepository.findFromSessionId(sid);

            if (session) {
                req.session = session;
            }

        } catch (ex) {
            // do nothing
        }
    }

    next();
};