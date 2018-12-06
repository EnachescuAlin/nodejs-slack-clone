import Channel from '../server/channel/channel';
import User from '../server/user/user'
import server from '../server/index';
import { secret } from '../server/constants';

import { sign } from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const channels = [
    {
        channel: {
            name: "public1",
            description: "public1",
            isPublic: true
        },
        id: ""
    },
    {
        channel: {
            name: "public2",
            description: "public2",
            isPublic: true
        },
        id: ""
    },
    {
        channel: {
            name: "private1",
            description: "private1",
            isPublic: false
        },
        id: ""
    },
    {
        channel: {
            name: "private2",
            description: "private2",
            isPublic: false
        },
        id: ""
    }
];

const users = [
    {
        user: {
            username: "admin1",
            password: "admin1",
            email: "admin1@gmail.com",
            firstName: "admin1",
            lastName: "admin1"
        },
        token: "",
        id: ""
    },
    {
        user: {
            username: "admin2",
            password: "admin2",
            email: "admin2@gmail.com",
            firstName: "admin2",
            lastName: "admin2"
        },
        token: "",
        id: ""
    },
    {
        user: {
            username: "admin3",
            password: "admin3",
            email: "admin3@gmail.com",
            firstName: "admin3",
            lastName: "admin3"
        },
        token: "",
        id: ""
    },
    {
        user: {
            username: "admin4",
            password: "admin4",
            email: "admin4@gmail.com",
            firstName: "admin4",
            lastName: "admin4"
        },
        token: "",
        id: ""
    }
];

let tokenWithInvalidUserId;
let tokenWithNonExistentUserId;

let invalidUserId;
let nonExistentUserId;

let invalidChannelId;
let nonExistentChannelId;

describe('Channel', () => {
    before(async () => {
        let res;
        for (let i = 0; i < users.length; i++) {
            res = await chai.request(server).post('/api/users/register').send(users[i].user);
            users[i].id = res.body.id;

            res = await chai.request(server).post('/api/users/login')
                .send({username: users[i].user.username, password: users[i].user.password});
            users[i].token = res.body.token;
        }

        invalidUserId = "123";
        nonExistentUserId = mongoose.Types.ObjectId.createFromTime(Date.now());

        tokenWithInvalidUserId = sign({sub: "123", name: "qwe"}, secret);
        tokenWithNonExistentUserId = sign({ sub: nonExistentUserId, name: "asd" }, secret);

        invalidChannelId = "123";
        nonExistentChannelId = mongoose.Types.ObjectId.createFromTime(Date.now());
    });

    after(async () => {
        await User.deleteMany({});
        await Channel.deleteMany({});
    });

    describe('create', () => {
        it('it should create a channel', async () => {
            let res;
            for (let i = 0; i < channels.length; i++) {
                res = await chai.request(server).post('/api/channels/')
                    .auth(users[i].token, { type: 'bearer' })
                    .send(channels[i].channel);

                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.not.have.property('error');

                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('isPublic');
                res.body.should.have.property('creationDate');
                res.body.should.have.property('createdBy');
                res.body.should.have.property('members');

                res.body.name.should.be.eql(channels[i].channel.name);
                res.body.description.should.be.eql(channels[i].channel.description);
                res.body.isPublic.should.be.eql(channels[i].channel.isPublic);

                res.body.createdBy.should.be.eql(users[i].id);
                res.body.members.should.have.length(1);
                res.body.members[0].should.be.eql(users[i].id);

                channels[i].id = res.body.id;

                res = await chai.request(server).get('/api/users/authenticated/current')
                    .auth(users[i].token, { type: 'bearer' });
    
                res.should.have.status(200);
                res.body.should.be.a('object');
    
                res.body.should.not.have.property('error');

                res.body.should.have.property('channels');
                res.body.channels.should.have.length(1);
                res.body.channels[0].should.be.eql(channels[i].id);
            }
        });

        it('it should not create a channel without auth', async () => {
            let res = await chai.request(server).post('/api/channels/').send(channels[0].channel);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not create a channel with a name that already exists', async () => {
            let res = await chai.request(server).post('/api/channels/')
                .auth(users[0].token, { type: 'bearer' })
                .send(channels[0].channel);

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Name ${channels[0].channel.name} already exists`);
        });
    });

    describe('getAll', () => {
        it('it should get all public channels', async () => {
            let res;
            for (let i = 0; i < users.length; i++) {
                res = await chai.request(server).get('/api/channels/')
                    .auth(users[i].token, { type: 'bearer' });

                res.should.have.status(200);
                res.body.should.be.a('array');

                res.body.should.have.length(2);

                for (let j = 0; j < 2; j++) {
                    res.body[j].should.be.a('object');

                    res.body[j].should.not.have.property('error');

                    res.body[j].should.have.property('id');
                    res.body[j].should.have.property('name');
                    res.body[j].should.have.property('description');
                    res.body[j].should.have.property('isPublic');
                    res.body[j].should.have.property('creationDate');
                    res.body[j].should.have.property('createdBy');
                    res.body[j].should.have.property('members');

                    res.body[j].name.should.be.eql(channels[j].channel.name);
                    res.body[j].description.should.be.eql(channels[j].channel.description);
                    res.body[j].isPublic.should.be.eql(channels[j].channel.isPublic);

                    res.body[j].createdBy.should.be.eql(users[j].id);
                    res.body[j].members.should.have.length(1);
                    res.body[j].members[0].should.be.eql(users[j].id);
                }
            }
        });

        it('it should not get all public channels without auth', async () => {
            let res = await chai.request(server).get('/api/channels/');

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });
    });

    describe('getChannelById', () => {
        it('it should get a public channel by id', async () => {
            let res;
            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < 2; j++) {
                    res = await chai.request(server).get(`/api/channels/${channels[j].id}`)
                        .auth(users[i].token, { type: 'bearer' });

                    res.should.have.status(200);
                    res.body.should.be.a('object');
    
                    res.body.should.not.have.property('error');
    
                    res.body.should.have.property('id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('description');
                    res.body.should.have.property('isPublic');
                    res.body.should.have.property('creationDate');
                    res.body.should.have.property('createdBy');
                    res.body.should.have.property('members');
    
                    res.body.name.should.be.eql(channels[j].channel.name);
                    res.body.description.should.be.eql(channels[j].channel.description);
                    res.body.isPublic.should.be.eql(channels[j].channel.isPublic);
    
                    res.body.createdBy.should.be.eql(users[j].id);
                    res.body.members.should.have.length(1);
                    res.body.members[0].should.be.eql(users[j].id);
                }
            }
        });


        it('it should get a private channel by id', async () => {
            let res;
            for (let i = 2; i < 4; i++) {
                res = await chai.request(server).get(`/api/channels/${channels[i].id}`)
                    .auth(users[i].token, { type: 'bearer' });

                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.not.have.property('error');

                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('isPublic');
                res.body.should.have.property('creationDate');
                res.body.should.have.property('createdBy');
                res.body.should.have.property('members');

                res.body.name.should.be.eql(channels[i].channel.name);
                res.body.description.should.be.eql(channels[i].channel.description);
                res.body.isPublic.should.be.eql(channels[i].channel.isPublic);

                res.body.createdBy.should.be.eql(users[i].id);
                res.body.members.should.have.length(1);
                res.body.members[0].should.be.eql(users[i].id);
            }
        });

        it('it should not get a non-existent channel by id', async () => {
            let res = await chai.request(server).get(`/api/channels/${nonExistentChannelId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${nonExistentChannelId} was not found`);
        });

        it('it should not get a channel by invalid id', async () => {
            let res = await chai.request(server).get(`/api/channels/${invalidChannelId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${invalidChannelId} was not found`);
        });

        it('it should not get a private channel', async () => {
            let res;
            for (let i = 0; i < users.length; i++) {
                for (let j = 2; j < 4; j++) {
                    if (i === j) {
                        continue;
                    }

                    res = await chai.request(server).get(`/api/channels/${channels[j].id}`)
                        .auth(users[i].token, { type: 'bearer' });

                    res.should.have.status(403);
                    res.body.should.be.a('object');
    
                    res.body.should.have.property('error');
                    res.body.error.should.be.eql('Not allowed to view this channel');
                }
            }
        });

        it('it should not get a channel without auth', async () => {
            let res = await chai.request(server).get(`/api/channels/${invalidChannelId}`);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });
    });

    describe('join', () => {
        it('it should not join to a channel without auth', async () => {
            let res = await chai.request(server).post(`/api/channels/${channels[0].id}/participants`);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not join to an invalid channel id', async () => {
            let res = await chai.request(server).post(`/api/channels/${invalidChannelId}/participants`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${invalidChannelId} was not found`);
        });

        it('it should not join to a non-existent channel id', async () => {
            let res = await chai.request(server).post(`/api/channels/${nonExistentChannelId}/participants`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${nonExistentChannelId} was not found`);
        });

        it('it should not join to a private channel', async () => {
            let res;
            for (let i = 2; i < 4; i++) {
                res = await chai.request(server)
                    .post(`/api/channels/${channels[i].id}/participants`)
                    .auth(users[0].token, { type: 'bearer' });

                res.should.have.status(403);
                res.body.should.be.a('object');
    
                res.body.should.have.property('error');
                res.body.error.should.be.eql('Not allowed to join this channel');
            }
        });

        it('it should not join an invalid user id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants`)
                .auth(tokenWithInvalidUserId, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`User with id = ${invalidUserId} was not found`);
        });

        it('it should not join a non-existent user id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants`)
                .auth(tokenWithNonExistentUserId, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`User with id = ${nonExistentUserId} was not found`);
        });

        it('it should not join a joined user', async () => {
            let res;
            for (let i = 0; i < 2; i++) {
                res = await chai.request(server)
                    .post(`/api/channels/${channels[i].id}/participants`)
                    .auth(users[i].token, { type: 'bearer' });
                    
                res.should.have.status(422);
                res.body.should.be.a('object');
                
                res.body.should.have.property('error');
                res.body.error.should.be.eql('You already joined this channel');
            }
        });

        it('it should join a user to a public channel', async () => {
            let res;

            res = await chai.request(server)
                .post(`/api/channels/${channels[1].id}/participants`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(204);
            res.body.should.be.empty;

            res = await chai.request(server)
                .get(`/api/channels/${channels[1].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');
            res.body.should.have.property('members');
            res.body.members.should.have.length(2);
            res.body.members[0].should.be.eql(users[1].id);
            res.body.members[1].should.be.eql(users[0].id);

            res = await chai.request(server)
                .get('/api/users/authenticated/current')
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');
            res.body.should.have.property('channels');
            res.body.channels.should.have.length(2);
            res.body.channels[0].should.be.eql(channels[0].id);
            res.body.channels[1].should.be.eql(channels[1].id);
        });
    });

    describe('invite', () => {
        it('it should not invite without auth', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${users[0].id}`);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not invite itself', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${users[0].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot invite yourself');
        });

        it('it should not invite in an invalid channel id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${invalidChannelId}/participants/${users[3].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${invalidChannelId} was not found`);
        });

        it('it should not invite in a non-existent channel id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${nonExistentChannelId}/participants/${users[3].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${nonExistentChannelId} was not found`);
        });

        it('it should not be invited by an invalid user id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${users[0].id}`)
                .auth(tokenWithInvalidUserId, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`User with id = ${invalidUserId} was not found`);
        });

        it('it should not be invited by a non-existent user id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${users[0].id}`)
                .auth(tokenWithNonExistentUserId, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`User with id = ${nonExistentUserId} was not found`);
        });

        it('it should not invite an invalid guest id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${invalidUserId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Guest with id = ${invalidUserId} was not found`);
        });

        it('it should not invite a non-existent guest id', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${nonExistentUserId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Guest with id = ${nonExistentUserId} was not found`);
        });

        it('it should not be invited by a user that is not joined', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${users[2].id}`)
                .auth(users[3].token, { type: 'bearer' });

            res.should.have.status(422);
            res.body.should.be.a('object');
    
            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot invite users in this channel');
        });

        it('it should not invite a user who is already joined', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[1].id}/participants/${users[0].id}`)
                .auth(users[1].token, { type: 'bearer' });

            res.should.have.status(422);
            res.body.should.be.a('object');
    
            res.body.should.have.property('error');
            res.body.error.should.be.eql('Guest already joined this channel');
        });

        it('it should invite a user to a public channel', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[0].id}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(204);
            res.body.should.be.empty;

            res = await chai.request(server)
                .get(`/api/channels/${channels[0].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');
            res.body.should.have.property('members');
            res.body.members.should.have.length(2);
            res.body.members[0].should.be.eql(users[0].id);
            res.body.members[1].should.be.eql(users[1].id);

            res = await chai.request(server)
                .get('/api/users/authenticated/current')
                .auth(users[1].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');
            res.body.should.have.property('channels');
            res.body.channels.should.have.length(2);
            res.body.channels[0].should.be.eql(channels[1].id);
            res.body.channels[1].should.be.eql(channels[0].id);
        });

        it('it should invite a user to a private channel', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[2].id}/participants/${users[1].id}`)
                .auth(users[2].token, { type: 'bearer' });

            res.should.have.status(204);
            res.body.should.be.empty;

            res = await chai.request(server)
                .get(`/api/channels/${channels[2].id}`)
                .auth(users[2].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');
            res.body.should.have.property('members');
            res.body.members.should.have.length(2);
            res.body.members[0].should.be.eql(users[2].id);
            res.body.members[1].should.be.eql(users[1].id);

            res = await chai.request(server)
                .get('/api/users/authenticated/current')
                .auth(users[1].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');
            res.body.should.have.property('channels');
            res.body.channels.should.have.length(3);
            res.body.channels[0].should.be.eql(channels[1].id);
            res.body.channels[1].should.be.eql(channels[0].id);
            res.body.channels[2].should.be.eql(channels[2].id);
        });
    });

    describe('kickout', () => {
        it('it should not kickout without auth', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[2].id}/participants/${users[1].id}`);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not kickout if channel id is invalid', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${invalidChannelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${invalidChannelId} was not found`);
        });

        it('it should not kickout if channel id not found', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${nonExistentChannelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${nonExistentChannelId} was not found`);
        });

        it('it should not kickout if user id is invalid', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[0].id}/participants/${users[1].id}`)
                .auth(tokenWithInvalidUserId, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`User with id = ${invalidUserId} was not found`);
        });

        it('it should not kickout if user id not found', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[0].id}/participants/${users[1].id}`)
                .auth(tokenWithNonExistentUserId, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`User with id = ${nonExistentUserId} was not found`);
        });

        it('it should not kickout if member id is invalid', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[0].id}/participants/${invalidUserId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Member with id = ${invalidUserId} was not found`);
        });

        it('it should not kickout if member id not found', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[0].id}/participants/${nonExistentUserId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Member with id = ${nonExistentUserId} was not found`);
        });

        it('it should not kickout if user id is not joined', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[3].id}/participants/${users[3].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You have not joined this channel');
        });

        it('it should not kickout if member id is not joined', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[3].id}/participants/${users[0].id}`)
                .auth(users[3].token, { type: 'bearer' });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Member with id = ${users[0].id} has not joined this channel`);
        });

        it('it should not kickout if member id is owner', async () => {
            let res = await chai.request(server)
                .delete(`/api/channels/${channels[2].id}/participants/${users[2].id}`)
                .auth(users[1].token, { type: 'bearer' });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot kickout the owner of the channel');
        });

        it('it should not kickout if user id is not owner', async () => {
            let res = await chai.request(server)
                .post(`/api/channels/${channels[2].id}/participants/${users[3].id}`)
                .auth(users[2].token, { type: 'bearer' });

            res.should.have.status(204);
            res.body.should.be.empty;

            res = await chai.request(server)
                .delete(`/api/channels/${channels[2].id}/participants/${users[3].id}`)
                .auth(users[1].token, { type: 'bearer' });

            res.should.have.status(403);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You have no permission to kickout members');
        });

        it('it should kickout a user from public channel', async () => {
            const channel = {
                name: 'kickout-from-public-channel',
                description: 'a',
                isPublic: true
            };
            let channelId;
            let res;

            // create a temp channel
            res = await chai.request(server)
                .post('/api/channels/')
                .auth(users[0].token, { type: 'bearer' })
                .send(channel);
            res.should.have.status(200);
            channelId = res.body.id;

            // invite a user
            res = await chai.request(server)
                .post(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(204);

            // kickout the user
            res = await chai.request(server)
                .delete(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(204);
            res.body.should.be.empty;

            // check if the user was removed
            res = await chai.request(server)
                .get(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.members.should.length(1);
            res.body.members[0].should.be.eql(users[0].id);

            // check if the channel id was removed from user's channels array
            res = await chai.request(server)
                .get('/api/users/authenticated/current')
                .auth(users[1].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.channels.should.not.include(channelId);
        });

        it('it should kickout a user from private channel', async () => {
            const channel = {
                name: 'kickout-from-private-channel',
                description: 'a',
                isPublic: false
            };
            let channelId;
            let res;

            // create a temp channel
            res = await chai.request(server)
                .post('/api/channels/')
                .auth(users[0].token, { type: 'bearer' })
                .send(channel);
            res.should.have.status(200);
            channelId = res.body.id;

            // invite a user
            res = await chai.request(server)
                .post(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(204);

            // kickout the user
            res = await chai.request(server)
                .delete(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(204);
            res.body.should.be.empty;

            // check if the user was removed
            res = await chai.request(server)
                .get(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.members.should.length(1);
            res.body.members[0].should.be.eql(users[0].id);

            // check if the channel id was removed from user's channels array
            res = await chai.request(server)
                .get('/api/users/authenticated/current')
                .auth(users[1].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.channels.should.not.include(channelId);
        });

        it('it should leave a public channel', async () => {
            const channel = {
                name: 'leave-from-public-channel',
                description: 'a',
                isPublic: true
            };
            let channelId;
            let res;

            // create a temp channel
            res = await chai.request(server)
                .post('/api/channels/')
                .auth(users[0].token, { type: 'bearer' })
                .send(channel);
            res.should.have.status(200);
            channelId = res.body.id;

            // invite a user
            res = await chai.request(server)
                .post(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(204);

            // kickout the user
            res = await chai.request(server)
                .delete(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[1].token, { type: 'bearer' });
            res.should.have.status(204);
            res.body.should.be.empty;

            // check if the user was removed
            res = await chai.request(server)
                .get(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.members.should.length(1);
            res.body.members[0].should.be.eql(users[0].id);

            // check if the channel id was removed from user's channels array
            res = await chai.request(server)
                .get('/api/users/authenticated/current')
                .auth(users[1].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.channels.should.not.include(channelId);
        });

        it('it should leave a private channel', async () => {
            const channel = {
                name: 'leave-from-private-channel',
                description: 'a',
                isPublic: false
            };
            let channelId;
            let res;

            // create a temp channel
            res = await chai.request(server)
                .post('/api/channels/')
                .auth(users[0].token, { type: 'bearer' })
                .send(channel);
            res.should.have.status(200);
            channelId = res.body.id;

            // invite a user
            res = await chai.request(server)
                .post(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(204);

            // leave from channel
            res = await chai.request(server)
                .delete(`/api/channels/${channelId}/participants/${users[1].id}`)
                .auth(users[1].token, { type: 'bearer' });
            res.should.have.status(204);
            res.body.should.be.empty;

            // check if the user was removed
            res = await chai.request(server)
                .get(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.members.should.length(1);
            res.body.members[0].should.be.eql(users[0].id);

            // check if the channel id was removed from user's channels array
            res = await chai.request(server)
                .get('/api/users/authenticated/current')
                .auth(users[1].token, { type: 'bearer' });
            res.should.have.status(200);
            res.body.channels.should.not.include(channelId);
        });
    });

    describe('update', () => {
        it('it should not update without auth', async () => {
            let res = await chai.request(server).put(`/api/channels/${channels[0].id}`);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not update an invalid channel id', async () => {
            let res = await chai.request(server).put(`/api/channels/${invalidChannelId}`)
                .auth(users[0].token, { type: 'bearer'});

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${invalidChannelId} was not found`);
        });

        it('it should not update a non-existent channel id', async () => {
            let res = await chai.request(server).put(`/api/channels/${nonExistentChannelId}`)
                .auth(users[0].token, { type: 'bearer'});

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${nonExistentChannelId} was not found`);
        });

        it('it should not update if user id is not owner', async () => {
            let res = await chai.request(server).put(`/api/channels/${channels[1].id}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(403);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot update channel');
        });

        it('it should not update if user id is invalid', async () => {
            let res = await chai.request(server).put(`/api/channels/${channels[0].id}`)
                .auth(tokenWithInvalidUserId, { type: 'bearer' });

            res.should.have.status(403);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot update channel');
        });

        it('it should not update if user id not found', async () => {
            let res = await chai.request(server).put(`/api/channels/${channels[0].id}`)
                .auth(tokenWithNonExistentUserId, { type: 'bearer' });

            res.should.have.status(403);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot update channel');
        });

        it('it should not update if the new name is already taken', async () => {
            let res = await chai.request(server).put(`/api/channels/${channels[0].id}`)
                .auth(users[0].token, { type: 'bearer' })
                .send({ name: channels[1].name});

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`This name is already taken`);
        });

        it('it should update a public channel', async () => {
            const initial = {
                name: 'test-channel-public',
                description: 'blablabla',
                isPublic: true
            };
            const updated = {
                name: 'test-channel-public-changed',
                description: 'blablabla-changed',
                isPublic: false
            };
            let res;

            res = await chai.request(server).post('/api/channels/')
                .auth(users[0].token, { type: 'bearer' })
                .send(initial);
            const channelId = res.body.id;

            res = await chai.request(server).put(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' })
                .send(updated)

            res.should.have.status(204);
            res.body.should.be.empty;

            res = await chai.request(server).get(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');

            res.body.should.have.property('id');
            res.body.should.have.property('name');
            res.body.should.have.property('description');
            res.body.should.have.property('isPublic');
            res.body.should.have.property('creationDate');
            res.body.should.have.property('createdBy');
            res.body.should.have.property('members');

            res.body.name.should.be.eql(updated.name);
            res.body.description.should.be.eql(updated.description);
            res.body.isPublic.should.be.eql(updated.isPublic);

            res.body.createdBy.should.be.eql(users[0].id);
            res.body.members.should.have.length(1);
            res.body.members[0].should.be.eql(users[0].id);
        });

        it('it should update a private channel', async () => {
            const initial = {
                name: 'test-channel-private',
                description: 'blablabla',
                isPublic: false
            };
            const updated = {
                name: 'test-channel-private-changed',
                description: 'blablabla-changed',
                isPublic: true
            };
            let res;

            res = await chai.request(server).post('/api/channels/')
                .auth(users[0].token, { type: 'bearer' })
                .send(initial);
            const channelId = res.body.id;

            res = await chai.request(server).put(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' })
                .send(updated)

            res.should.have.status(204);
            res.body.should.be.empty;

            res = await chai.request(server).get(`/api/channels/${channelId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');

            res.body.should.have.property('id');
            res.body.should.have.property('name');
            res.body.should.have.property('description');
            res.body.should.have.property('isPublic');
            res.body.should.have.property('creationDate');
            res.body.should.have.property('createdBy');
            res.body.should.have.property('members');

            res.body.name.should.be.eql(updated.name);
            res.body.description.should.be.eql(updated.description);
            res.body.isPublic.should.be.eql(updated.isPublic);

            res.body.createdBy.should.be.eql(users[0].id);
            res.body.members.should.have.length(1);
            res.body.members[0].should.be.eql(users[0].id);
        });
    });
});
