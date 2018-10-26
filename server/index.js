import http from 'http';
import express, { json } from 'express';
import errorHandler from './errorHandler';
import jwt from './jwt';
import userController from './user/usersController';
import mongoose from 'mongoose';

async function init()
{
    await mongoose.set('useCreateIndex', true)
    await mongoose.connect('mongodb://localhost/slack_clone_db', { useNewUrlParser: true }, (err) => {
        if (err) {
            console.log('connect to database failed =', err);
        } else {
            console.log('connected to database successfully');
        }
    });
}

init();

const app = express(http);

app.use(json());

app.use(jwt());

// api routes
app.use('/users', userController);

// global error handler
app.use(errorHandler);

// start server
const port = 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
