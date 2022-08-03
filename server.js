const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();

const port = 8000;
const dbUrl = 'mongodb+srv://kcherednik:rLvOD1befzfSbvau@cluster0.i98rv.mongodb.net/test'

app.use(bodyParser.json());

new MongoClient(dbUrl)
    .connect()
    .then((database) => {
        const db = database.db('app')
        require('./app/routes')(app, db);

        app.listen(port, () => {
            console.log('We are live on ' + port);
        })
    })
    .catch(console.error);
