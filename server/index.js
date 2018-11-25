import http from 'http';
import express, {
    json
} from 'express';
import errorHandler from './middlewares/errorHandler';
import jwt from './middlewares/jwt';
import addWebpackHotMiddleware from './middlewares/webpackMiddleware';
import path from 'path';

import userController from './user/usersController';
import channelController from './channel/channelsController';
import messagesController from './message/messageController';

import mongoose from 'mongoose';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

async function init() {
    await mongoose.set('useCreateIndex', true)
    await mongoose.set('useFindAndModify', false);
    await mongoose.connect('mongodb://localhost/slack_clone_db', {
        useNewUrlParser: true
    }, async (err) => {
        if (err) {
            await console.log('connect to database failed =', err);
        } else {
            await console.log('connected to database successfully');
        }
    });
}

init();

const app = express(http);

app.use(json());

app.use('/api', jwt());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// api routes
app.use('/api/users', userController);
app.use('/api/channels', channelController);
app.use('/api/messages', messagesController);

// global error handler
app.use(errorHandler);

// client app
app.use('/public', express.static(path.resolve(__dirname, '../client/public')));

if (process.env.NODE_ENV == 'development') {
    addWebpackHotMiddleware(app);
} else {
    app.use('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../client', 'index.html'));
    });
}

// start server
const port = 3000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

export default app; // for testing
