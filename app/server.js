const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();

const port = 8000;
const dbUrl = process.env.DB_URL;

app.use(bodyParser.json());

new MongoClient(dbUrl)
    .connect()
    .then((database) => {
        const db = database.db( process.env.DB_NAME)
        require('./routes')(app, db.collection(process.env.DB_COLLECTIONS_EMPLOYEE));

        app.listen(port, () => {
            console.log('We are live on ' + port);
        })
    })
    .catch(console.error);
