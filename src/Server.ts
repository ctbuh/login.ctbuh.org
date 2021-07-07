import {Application, NextFunction, Request, Response, Router} from "express";
import path from "path";
import {ErrorHandler} from "./ErrorHandler";
import {stringContainsAnyFromArray} from "./lib/Util";

const express = require('express');

// extras!
const cookieParser = require('cookie-parser');
const cors = require('cors');

export class Server {

    public static readonly PORT_DEFAULT: number = 3000;

    protected app: Application;
    protected router: Router;

    protected corsWhiteList: string[] = [];

    constructor() {

        let app = express();

        this.router = Router();

        app.set('etag', false);
        app.disable('x-powered-by');

        app.set('trust proxy', true);
        app.set('json spaces', 2);

        this.app = app;

        // by default
        this.enablePost();
        this.bootStatic();
        this.enableCookies();
        this.enableCors();
    }

    public getRouter(): Router {
        return this.router;
    }

    protected enablePost() {

        // for parsing application/x-www-form-urlencoded
        this.app.use(express.urlencoded({
            extended: true
        }));
    }

    protected bootStatic() {
        let p = path.join(__dirname, '../public');

        this.app.use(express.static(p, {
            etag: false
        }));
    }

    protected enableCookies() {
        this.app.use(cookieParser());
    }

    public setCorsWhiteList(list: string[]) {
        this.corsWhiteList = list;
    }

    protected enableCors() {

        const oThis = this;

        this.app.use(cors({
            // Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '*'
            origin: function (origin: string, callback: any) {
                if (oThis.corsWhiteList.length === 0 || stringContainsAnyFromArray(origin, oThis.corsWhiteList)) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            },
            credentials: true
        }));
    }

    protected bootErrorHandler() {

        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {

            ErrorHandler.report(err);

            let msg = err.toString();

            return res.status(500).json({
                'message': 'Something went wrong...',
                'error': msg
            });

        });
    }

    protected registerNotFoundHandler() {

        this.app.all('*', (req: Request, res: Response, next: any) => {

            res.status(404).json({
                status: '404',
                message: `Can't find ${req.originalUrl} on this server!`
            });
        });
    }

    start(port: number) {

        this.app.use(this.router);

        // for everything else:
        this.registerNotFoundHandler();
        this.bootErrorHandler();

        this.app.listen(port, function () {
            console.log(`Example app listening on port ${port}!`)
        });
    }
}