const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(3200, () => {
    console.log('Example app listening at http://localhost:3200');
});