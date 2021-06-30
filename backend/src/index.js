
// .env files support
require('dotenv').config();

// webserver
const express = require('express');
const app = express();

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
const login = require('./routes/login');
app.get('/login', login);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

// error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send(JSON.stringify(err, null, 2));
});

// listen
app.listen(3200, () => {
    console.log('Listening at http://localhost:3200');
});