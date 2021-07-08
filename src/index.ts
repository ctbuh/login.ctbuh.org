import {HomeController} from "./controllers/HomeController";
import {CallbackController} from "./controllers/CallbackController";
import {AuthController} from "./controllers/AuthController";
import {InfoController, MeController} from "./controllers/InfoController";
import {LogoutController} from "./controllers/LogoutController";
import {Server} from "./Server";
import {SessionAuthMiddleware} from "./middleware/SessionAuthMiddleware";
import {HealthCheckController} from "./controllers/HealthCheck";
import {getItemsFromCommaList} from "./lib/Util";
import {AppConfig, ConfigSchemaValidator} from "./config";

const {error} = ConfigSchemaValidator.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const server = new Server();

if (AppConfig.cors_white_list) {
    server.setCorsWhiteList(getItemsFromCommaList(AppConfig.cors_white_list));
}

let router = server.getRouter();
router.use(SessionAuthMiddleware);

router.get('/', HomeController);
router.get('/auth', AuthController);
router.get('/callback', CallbackController);

router.get('/me', MeController);
router.post('/info', InfoController);

router.get('/logout', LogoutController);

router.get('/healthcheck', HealthCheckController);

// @ts-ignore
const port: number = process.env.PORT || 3000;

server.start(port);


