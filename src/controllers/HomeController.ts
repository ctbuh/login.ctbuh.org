import {Request, Response} from "express";

export const HomeController = function (req: Request, res: Response, next: any) {

    const referer = req.header('Referer');

    if (referer) {
        return res.redirect(302, '/auth?_next=' + referer);
    }

    res.send('Hello world');
};