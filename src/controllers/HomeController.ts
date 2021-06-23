import {Request, Response} from "express";

export const HomeController = function (req: Request, res: Response, next: any) {

    res.json({
        'logged_in': !!req.session,
        'session_id': req.session?.sid
    });

};