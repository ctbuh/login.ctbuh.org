import {Request, Response} from "express";
import {SessionRepository} from "../SessionRepository";
import {asyncHandler} from "../types";
import {TokenClient} from "../TokenClient";

const tokenClient = new TokenClient();

export const LogoutController = asyncHandler(async function (req: Request, res: Response) {

    const session = req.session;

    if (session) {

        // revoke all tokens INCLUDING refresh first
        await tokenClient.revokeQuietly(session.getToken(), true);

        // mark Session as expired in database
        await SessionRepository.revoke(session);

        // remove session cookie too
        res.clearCookie('sso_id');
    }

    res.redirect(302, '/');

});