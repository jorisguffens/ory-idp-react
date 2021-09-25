// .env files support
require('dotenv').config();

// webserver
const express = require('express');
const app = express();

// cookie middleware
app.use(require("cookie-parser")());

// session middleware
app.use(
    require('express-session')({
        secret: 'POGGERS',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
)

// routes
app.get('/login', require('./routes/login'));
app.get('/consent', require('./routes/consent'));

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// error handler
app.use((req, res, next) => {
    try {
        next();
    } catch(err) {
        res.status(500).send(JSON.stringify(err, null, 2));
    }
});

// listen
app.listen(3200, () => {
    console.log('Listening at http://localhost:3200');
});