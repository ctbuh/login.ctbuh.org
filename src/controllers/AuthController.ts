import {Request, Response} from "express";
import {Client} from "../Client";
import {AuthRequest} from "../requests/AuthRequest";
import {dateWeeksFromNow} from "../lib/Util";

const force = new Client();

export const AuthController = function (req: Request, res: Response) {

    const authRequest = new AuthRequest(req);

    // We are logged in AND tokens are still valid
    if (authRequest.isLoggedIn() && authRequest.isSessionValid()) {

        // where do we redirect next? can this ever be empty?
        const next = authRequest.getRedirectUriWithToken();

        if (next) {
            return res.redirect(302, next);
        }

        return res.redirect(302, '/');
    }

    // where to redirect upon successful login?
    const next = authRequest.getNextFromQueryOrReferer();

    if (next) {

        res.cookie('next', next, {
            expires: dateWeeksFromNow()
        });
    }

    let loginUrl = force.getAuthUrl();

    res.redirect(302, loginUrl);

};