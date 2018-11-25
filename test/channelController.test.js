import Channel from '../server/channel/channel';
import server from '../server/index';

import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

chai.use(chaiHttp);

describe('Channel', () => {
    before(async () => {
        await Channel.deleteMany({});
    });

    describe('create', () => {
        it('it should create a channel', async () => {

        });

        it('it should not create a channel with a name that already exists', async () => {

        });
    });
});
