// .env files support
require('dotenv').config();

// webserver
const express = require('express');
const app = express();

// MIDDLEWARE

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// cookies
app.use(require("cookie-parser")());

// sessions
app.use(
    require('express-session')({
        secret: 'POGGERS',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
)

// ROUTES

// login
app.get('/login', require('./routes/login'));

// consent
const cm = require('./routes/consent');
app.get('/consent', cm.consent);
app.get('/consentInfo', cm.consentInfo);
app.post('/consent', cm.consentFinish);

// ERROR HANDLER
const HttpError = require("./httpError");
app.use((err, req, res, next) => {
    if ( err instanceof HttpError ) {
        res.status(err.code).json({error: err.message});
    } else {
        res.status(500).json({
            error: err.message
        });
    }
});

// LISTEN
app.listen(3200, () => {
    console.log('Listening at http://localhost:3200');
});