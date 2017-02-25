'use strict';

const express = require('express');

const path = require('path');
const fs = require('fs')
const formidable = require('formidable')

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

app.post('/photos', (request, response) => {
    let form = new formidable.IncomingForm()

    let name = ''

    form.uploadDir = path.join(__dirname, '/uploads')

    form.on('file', (field, file) => {
        name = file.name
    fs.rename(file.path, path.join(form.uploadDir, name))
})

    form.on('end', () => {
        let container  = {
            id: Date.now() * Math.random(),
            url: `/uploads/${name}`
        }
        response.send(JSON.stringify(container))
    });
    form.parse(request)
});

app.listen(port);
console.log(`Server running on port ${port}`);