import {AppConfig} from "./config";

const Sentry = require("@sentry/node");

Sentry.init({
    dsn: AppConfig.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

export class ErrorHandler {

    // Not sent synchronously!!! If process gets killed right away, error will not be delivered to sentry.
    private static sentryErrorHandler(err: any) {
        Sentry.captureException(err);
    }

    static report(err: any) {
        this.sentryErrorHandler(err);
    }
}