import mongoose from 'mongoose';
import * as Server from '../server/index';

describe('Test controllers', () => {
    before(async () => {
        await Server.connectToMongo();
        await mongoose.connection.db.dropDatabase();
    });

    require('./userController.test');
    require('./channelController.test');

    after(async () => {
        await mongoose.connection.db.dropDatabase();
    });
});
