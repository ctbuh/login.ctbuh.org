require('dotenv').config();

const express = require('express');

const redis = require('redis');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();

app.use(cookieParser());

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient();

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: process.env.APP_KEY,
    cookie: {
        expires: new Date(Date.now() + (1000 * 60 * 60 * 2))
    },
    resave: false
}));

app.use(cors({
    // origin: true
}));

app.set('trust proxy', true);

app.use(express.static(__dirname + '/public'));

module.exports = app;