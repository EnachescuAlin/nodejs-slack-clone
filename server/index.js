import http from 'http';
import express, {
    json
} from 'express';
import errorHandler from './errorHandler';
import jwt from './jwt';
import usersController from './user/usersController';
import messagesController from './message/messageController';
import mongoose from 'mongoose';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

async function init() {
    await mongoose.set('useCreateIndex', true)
    await mongoose.set('useFindAndModify', false);
    await mongoose.connect('mongodb://localhost/slack_clone_db', {
        useNewUrlParser: true
    }, (err) => {
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

app.use('/api', jwt());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// api routes
app.use('/api/users', usersController);
app.use('/api/messages', messagesController);

// global error handler
app.use(errorHandler);

// start server
const port = 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});