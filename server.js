'use strict';

const express = require('express');

const data = require('./data.js');

const port = 3000;
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/photos', (req, res) => {
    res.set({
        'Content-Type': 'application/json',
        'Cache-Control':'no-cache'
    });
    res.send( JSON.stringify(data));
});

app.listen(port);
console.log(`Server running on port ${port}`);