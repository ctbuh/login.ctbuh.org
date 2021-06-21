/**
 * @typedef {Object} SalesforceConfig
 * @property {string} client_id
 * @property {string} client_secret
 * @property {string} oauth_login_url
 * @property {string} oauth_redirect_uri
 * @property {string} api_username
 * @property {string} api_password
 * @property {string} api_security_token
 *
 */


import {NextFunction, Request, Response} from "express";

/**
 * @typedef {Object} DatabaseConfig
 * @property {string} host
 * @property {string} database
 * @property {string} username
 * @property {string} password
 *
 */


export type StringOrNull = string | null;

export type StringCallback = (str: string) => void;

export type requestHandler = (req: Request, res: Response) => Promise<void>;

export const asyncHandler = function (fn: (req: Request, res: Response) => Promise<any>) {

    return function (req: Request, res: Response, next: NextFunction) {

        return Promise
            .resolve(fn(req, res))
            .catch(next);
    };
};
