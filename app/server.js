const express = require('express');
const mongoose = require('mongoose')
const employeeRouter = require('./routes/employee_routes')
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();

const port = 8000;
const dbUrl = process.env.DB_URL;

app.use(bodyParser.json());
app.use('/api/employees', employeeRouter);

const startServer = () => {
    app.listen(port, () => console.log('We are live on ' + port))
}

const connectDb = () => {
    mongoose.Promise = require('bluebird')
    mongoose.connect(dbUrl)
    return mongoose.connection
}

connectDb()
    .on('error', console.log)
    .on('disconnect', connectDb)
    .once('open', startServer)