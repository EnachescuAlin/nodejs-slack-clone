import http from 'http';
import express, {
    json
} from 'express';
import errorHandler from './middlewares/errorHandler';
import jwt from './middlewares/jwt';
import addWebpackHotMiddleware from './middlewares/webpackMiddleware';
import path from 'path';
import socketIo from 'socket.io';

import userController from './user/usersController';
import channelController from './channel/channelsController';
import messagesController from './message/messageController';

import mongoose from 'mongoose';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import socketMiddleware from './middlewares/socketMiddleware';

let mongodb_url;
if (process.env.NODE_ENV === 'test') {
    mongodb_url = 'mongodb://localhost/slack_clone_db_test';
} else {
    mongodb_url = 'mongodb://localhost/slack_clone_db';
}

async function init() {
    await mongoose.set('useCreateIndex', true)
    await mongoose.set('useFindAndModify', false);
    await mongoose.connect(mongodb_url, { useNewUrlParser: true }, async (err) => {
        if (err) {
            await console.log('connect to database failed =', err);
        } else {
            await console.log('connected to database successfully');
        }
    });
}

if (process.env.NODE_ENV != 'test') {
    init();
}

const app = express(http);
var server = http.createServer(app)
const io = socketIo(server);

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

// configure web sockets
io.on('connection', socketMiddleware(io));

// start server
const port = 3000;
server.listen(port, function () {
    console.log('Server listening on port ' + port);
});

exports.connectToMongo = init; // for testing
export default app; // for testing
