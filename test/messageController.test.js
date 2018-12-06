import Message from '../server/message/message';
import Channel from '../server/channel/channel';
import User from '../server/user/user'
import server from '../server/index';

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
            name: "private1",
            description: "private1",
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

let msgNum = 0;

let invalidChannelId;
let nonExistentChannelId;
let invalidUserId;
let nonExistentUserId;

let sentMessagesToChannels = [];
let sentMessagesToPrivateConversations = [];

describe('Message', () => {
    before(async () => {
        let res;

        // create users
        for (let i = 0; i < users.length; i++) {
            res = await chai.request(server).post('/api/users/register').send(users[i].user);
            users[i].id = res.body.id;

            res = await chai.request(server).post('/api/users/login')
                .send({username: users[i].user.username, password: users[i].user.password});
            users[i].token = res.body.token;
            res.should.have.status(200);
        }

        // create channels
        for (let i = 0; i < channels.length; i++) {
            res = await chai.request(server).post('/api/channels')
                .auth(users[0].token, { type: 'bearer' }).send(channels[i].channel);
            channels[i].id = res.body.id;
            res.should.have.status(200);
        }

        // invite users
        for (let i = 0; i < channels.length; i++) {
            for (let j = 1; j < users.length - 1; j++) {
                res = await chai.request(server)
                    .post(`/api/channels/${channels[i].id}/participants/${users[j].id}`)
                    .auth(users[0].token, { type: 'bearer' });
                res.should.have.status(204);
            }
        }

        invalidChannelId = "123";
        nonExistentChannelId = await mongoose.Types.ObjectId.createFromTime(Date.now());

        invalidUserId = "123";
        nonExistentUserId = await mongoose.Types.ObjectId.createFromTime(Date.now());
    });

    after(async () => {
        await User.deleteMany({});
        await Channel.deleteMany({});
        await Message.deleteMany({});
    });

    describe('addNewMessage', () => {
        it('it should not add message without auth', async () => {
            let res = await chai.request(server).post('/api/messages/')
                .send({ text: 'msg'});

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not add message without channeil id or receiver id', async () => {
            let res = await chai.request(server).post('/api/messages/')
                .auth(users[0].token, { type: 'bearer' }).send({ text: 'msg'});

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Neither channelId nor receiverId are set');
        });

        it('it should not add message to channel if channel id is invalid', async () => {
            let res = await chai.request(server).post('/api/messages/')
                .auth(users[0].token, { type: 'bearer' })
                .send({ text: 'msg', channelId: invalidChannelId });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${invalidChannelId} does not exist`);
        });

        it('it should not add message to channel for a non-existent channel id', async () => {
            let res = await chai.request(server).post('/api/messages/')
                .auth(users[0].token, { type: 'bearer' })
                .send({ text: 'msg', channelId: nonExistentChannelId });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${nonExistentChannelId} does not exist`);
        });

        it('it should not add message to channel if user is not joined', async () => {
            let res = await chai.request(server).post('/api/messages/')
                .auth(users[3].token, { type: 'bearer' })
                .send({ text: 'msg', channelId: channels[0].id });

            res.should.have.status(403);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`You are not a member of this channel`);
        });

        it('it should add message to channel', async () => {
            let res;
            for (let num = 0; num < 5; num++) {
                for (let i = 0; i < channels.length; i++) {
                    for (let j = 0; j < users.length - 1; j++) {
                        msgNum++;
                        const msg = {
                            text: `${users[j].user.username}-msg${msgNum}`,
                            channelId: channels[i].id
                        };

                        res = await chai.request(server)
                            .post('/api/messages/')
                            .auth(users[j].token, { type: 'bearer' })
                            .send(msg);

                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.not.have.property('error');
                        res.body.should.have.property('id');
                        res.body.should.have.property('sender');
                        res.body.should.have.property('text');
                        res.body.should.have.property('receiver');
                        res.body.should.have.property('addDate');

                        res.body.text.should.be.eql(msg.text);

                        res.body.sender.should.be.a('object');
                        res.body.sender.should.have.property('userId');
                        res.body.sender.should.have.property('username');
                        res.body.sender.userId.should.be.eql(users[j].id);
                        res.body.sender.username.should.be.eql(users[j].user.username);

                        res.body.receiver.should.be.a('object');
                        res.body.receiver.should.not.have.property('userId');
                        res.body.receiver.should.have.property('channelId');
                        res.body.receiver.channelId.should.be.eql(channels[i].id);

                        await sentMessagesToChannels.push(res.body);
                    }
                }
            }
        });

        it('it should not add message to private conversation if receiver id is invalid', async () => {
            let res = await chai.request(server).post('/api/messages/')
                .auth(users[0].token, { type: 'bearer' })
                .send({ text: 'msg', receiverId: invalidUserId });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot send a direct message to an unknown user');
        });

        it('it should not add message to private conversation for a non-existent receiver id', async () => {
            let res = await chai.request(server).post('/api/messages/')
                .auth(users[0].token, { type: 'bearer' })
                .send({ text: 'msg', receiverId: nonExistentUserId });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('You cannot send a direct message to an unknown user');
        });

        it('it should add message to private conversation', async () => {
            let res;
            for (let num = 0; num < 5; num++) {
                for (let i = 1; i < users.length; i++) {
                    // users[0] send 2 messages to users[i] where i > 0 && i < users.length
                    for (let j = 0; j < 2; j++) {
                        msgNum++;
                        const msg = {
                            text: `${users[0].user.username}-msg${msgNum}`,
                            receiverId: users[i].id
                        };

                        res = await chai.request(server)
                            .post('/api/messages/')
                            .auth(users[0].token, { type: 'bearer' })
                            .send(msg);

                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.not.have.property('error');
                        res.body.should.have.property('id');
                        res.body.should.have.property('sender');
                        res.body.should.have.property('text');
                        res.body.should.have.property('receiver');
                        res.body.should.have.property('addDate');

                        res.body.text.should.be.eql(msg.text);

                        res.body.sender.should.be.a('object');
                        res.body.sender.should.have.property('userId');
                        res.body.sender.should.have.property('username');
                        res.body.sender.userId.should.be.eql(users[0].id);
                        res.body.sender.username.should.be.eql(users[0].user.username);

                        res.body.receiver.should.be.a('object');
                        res.body.receiver.should.have.property('userId');
                        res.body.receiver.should.not.have.property('channelId');
                        res.body.receiver.userId.should.be.eql(users[i].id);

                        await sentMessagesToPrivateConversations.push(res.body);

                        // test users[0].directMessages
                        res = await chai.request(server)
                            .get('/api/users/authenticated/current')
                            .auth(users[0].token, { type: 'bearer' });

                        res.should.have.status(200);
                        if (num === 0) {
                            res.body.directMessages.should.have.length(i);
                            for (let k = 1; k <= i; k++) {
                                res.body.directMessages[k - 1].should.be.eql(users[k].id);
                            }
                        } else {
                            res.body.directMessages.should.have.length(users.length - 1);
                            for (let k = 1; k < users.length; k++) {
                                res.body.directMessages[k - 1].should.be.eql(users[k].id);
                            }
                        }

                       // test users[i].directMessages
                        res = await chai.request(server)
                            .get('/api/users/authenticated/current')
                            .auth(users[i].token, { type: 'bearer' });

                        res.should.have.status(200);
                        res.body.directMessages.should.have.length(1);
                        res.body.directMessages[0].should.be.eql(users[0].id);
                    }

                    // users[i] send 2 messages to users[0]
                    for (let j = 0; j < 2; j++) {
                        msgNum++;
                        const msg = {
                            text: `${users[i].user.username}-msg${msgNum}`,
                            receiverId: users[0].id
                        };

                        res = await chai.request(server)
                            .post('/api/messages/')
                            .auth(users[i].token, { type: 'bearer' })
                            .send(msg);

                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        res.body.should.not.have.property('error');
                        res.body.should.have.property('id');
                        res.body.should.have.property('sender');
                        res.body.should.have.property('text');
                        res.body.should.have.property('receiver');
                        res.body.should.have.property('addDate');

                        res.body.text.should.be.eql(msg.text);

                        res.body.sender.should.be.a('object');
                        res.body.sender.should.have.property('userId');
                        res.body.sender.should.have.property('username');
                        res.body.sender.userId.should.be.eql(users[i].id);
                        res.body.sender.username.should.be.eql(users[i].user.username);

                        res.body.receiver.should.be.a('object');
                        res.body.receiver.should.have.property('userId');
                        res.body.receiver.should.not.have.property('channelId');
                        res.body.receiver.userId.should.be.eql(users[0].id);

                        await sentMessagesToPrivateConversations.push(res.body);

                        // test users[0].directMessages
                        res = await chai.request(server)
                            .get('/api/users/authenticated/current')
                            .auth(users[0].token, { type: 'bearer' });

                        res.should.have.status(200);
                        if (num === 0) {
                            res.body.directMessages.should.have.length(i);
                            for (let k = 1; k <= i; k++) {
                                res.body.directMessages[k - 1].should.be.eql(users[k].id);
                            }
                        } else {
                            res.body.directMessages.should.have.length(users.length - 1);
                            for (let k = 1; k < users.length; k++) {
                                res.body.directMessages[k - 1].should.be.eql(users[k].id);
                            }
                        }

                       // test users[i].directMessages
                        res = await chai.request(server)
                            .get('/api/users/authenticated/current')
                            .auth(users[i].token, { type: 'bearer' });

                        res.should.have.status(200);
                        res.body.directMessages.should.have.length(1);
                        res.body.directMessages[0].should.be.eql(users[0].id);
                    }
                }
            }
        });
    });

    describe('getAllMessages', () => {
        it('it should not get messages without auth', async () => {
            let res = await chai.request(server).get('/api/messages/');

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should get all messages', async () => {
            let res;
            const allMsg = await sentMessagesToChannels.concat(sentMessagesToPrivateConversations);
            await allMsg.reverse();

            for (let i = 0; i < users.length; i++) {
                res = await chai.request(server).get('/api/messages/')
                    .auth(users[i].token, { type: 'bearer' });

                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(allMsg.length)
                res.body.should.be.eql(allMsg);
            }
        });

        it('it should get all messages in pages', async () => {
            let res;
            let allMsg;

            for (let i = 0; i < users.length; i++) {
                for (let pageSize = 1; pageSize <= 10; pageSize++) {
                    allMsg = await sentMessagesToChannels.concat(sentMessagesToPrivateConversations);
                    await allMsg.reverse();

                    const allMsgLength = allMsg.length;
                    let pageMax = Math.floor(allMsgLength / pageSize);
                    if (allMsgLength % pageSize != 0) {
                        pageMax++;
                    }

                    for (let page = 1; page <= pageMax; page++) {
                        let size = pageSize;
                        const begin = (page - 1) * pageSize;
                        if (begin + pageSize > allMsgLength) {
                            size = allMsgLength - begin;
                        }

                        const expectedMsg = allMsg.splice(0, size);

                        res = await chai.request(server).get('/api/messages/')
                            .query({ 'pageSize': pageSize, 'page': page })
                            .auth(users[i].token, { type: 'bearer' });

                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.should.have.length(size);
                        res.body.should.be.eql(expectedMsg);
                    }
                }
            }
        });
    });

    describe('getMessagesBySenderAndReceiver', () => {
        it('it should not get messages if sender id is invalid', async () => {
            let res = await chai.request(server).get('/api/messages/')
                .query({ senderId: invalidUserId, receiverId: users[0].id })
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');
    
            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Cannot find the sender with id = ${invalidUserId}`);
        });

        it('it should not get messages if receiver id is invalid', async () => {
            let res = await chai.request(server).get('/api/messages/')
                .query({ senderId: users[0].id, receiverId: invalidUserId })
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');
    
            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Cannot find the receiver with id = ${invalidUserId}`);
        });

        it('it should not get messages for a non-existent sender id', async () => {
            let res = await chai.request(server).get('/api/messages/')
                .query({ senderId: nonExistentUserId.toString(), receiverId: users[0].id })
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.empty;
        });

        it('it should not get messages for a non-existent receiver id', async () => {
            let res = await chai.request(server).get('/api/messages/')
                .query({ 'senderId': users[0].id, 'receiverId': nonExistentUserId.toString() })
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.empty;
        });

        it('it should get all messages for a private conversation', async () => {
            let res;
            for (let i = 1; i < users.length; i++) {
                let msg = await sentMessagesToPrivateConversations.filter((x) => {
                    if (x.sender.userId === users[0].id && x.receiver.userId === users[i].id) {
                        return true;
                    }
                    if (x.sender.userId === users[i].id && x.receiver.userId === users[0].id) {
                        return true;
                    }
                    return false;
                });
                await msg.reverse();

                res = await chai.request(server).get('/api/messages/')
                    .query({ senderId: users[0].id, receiverId: users[i].id })
                    .auth(users[0].token, { type: 'bearer' });
    
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(msg.length);
                res.body.should.be.eql(msg);

                res = await chai.request(server).get('/api/messages/')
                    .query({ senderId: users[i].id, receiverId: users[0].id })
                    .auth(users[i].token, { type: 'bearer' });

                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(msg.length);
                res.body.should.be.eql(msg);
            }
        });

        it('it should get all messages for a private conversation in pages', async () => {
            let res;
            for (let i = 1; i < users.length; i++) {
                for (let pageSize = 1; pageSize <= 10; pageSize++) {
                    let msg = await sentMessagesToPrivateConversations.filter((x) => {
                        if (x.sender.userId === users[0].id && x.receiver.userId === users[i].id) {
                            return true;
                        }
                        if (x.sender.userId === users[i].id && x.receiver.userId === users[0].id) {
                            return true;
                        }
                        return false;
                    });
                    await msg.reverse();

                    const msgLength = msg.length;
                    let pageMax = Math.floor(msgLength / pageSize);
                    if (msgLength % pageSize != 0) {
                        pageMax++;
                    }

                    for (let page = 1; page <= pageMax; page++) {
                        let size = pageSize;
                        const begin = (page - 1) * pageSize;
                        if (begin + pageSize > msgLength) {
                            size = msgLength - begin;
                        }

                        const expectedMsg = msg.splice(0, size);

                        res = await chai.request(server).get('/api/messages/')
                            .query({ senderId: users[0].id, receiverId: users[i].id, 'pageSize': pageSize, 'page': page })
                            .auth(users[0].token, { type: 'bearer' });
            
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.should.have.length(size);
                        res.body.should.be.eql(expectedMsg);
        
                        res = await chai.request(server).get('/api/messages/')
                            .query({ senderId: users[i].id, receiverId: users[0].id, 'pageSize': pageSize, 'page': page })
                            .auth(users[i].token, { type: 'bearer' });
        
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.should.have.length(size);
                        res.body.should.be.eql(expectedMsg);
                    }
                }
            }
        });
    });

    describe('getByChannel', () => {
        it('it should not get messages by channel without auth', async () => {
            let res = await chai.request(server).get(`/api/messages/channel/${channels[0].id}`);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not get messages if channel id is invalid', async () => {
            let res = await chai.request(server).get(`/api/messages/channel/${invalidChannelId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Channel with id = ${invalidChannelId} was not found`);
        });

        it('it should not get messages for a non-existent channel id', async () => {
            let res = await chai.request(server).get(`/api/messages/channel/${nonExistentChannelId}`)
                .auth(users[0].token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.empty;
        });

        it('it should get all messages for a channel', async () => {
            let res, msg;
            for (let i = 0; i < channels.length; i++) {
                msg = await sentMessagesToChannels.filter(x => x.receiver.channelId === channels[i].id);
                await msg.reverse();

                for (let j = 0; j < users.length - 1; j++) {
                    res = await chai.request(server)
                        .get(`/api/messages/channel/${channels[i].id}`)
                        .auth(users[j].token, { type: 'bearer' });
        
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(msg.length);
                    res.body.should.be.eql(msg);
                }
            }
        });

        it('it should get all messages for a channel in pages', async () => {
            let res, msg;
            for (let i = 0; i < channels.length; i++) {
                for (let j = 0; j < users.length - 1; j++) {
                    for (let pageSize = 1; pageSize <= 10; pageSize++) {
                        msg = await sentMessagesToChannels.filter(x => x.receiver.channelId === channels[i].id);
                        await msg.reverse();

                        const msgLength = msg.length;
                        let pageMax = Math.floor(msgLength / pageSize);
                        if (msgLength % pageSize != 0) {
                            pageMax++;
                        }
    
                        for (let page = 1; page <= pageMax; page++) {
                            let size = pageSize;
                            const begin = (page - 1) * pageSize;
                            if (begin + pageSize > msgLength) {
                                size = msgLength - begin;
                            }
    
                            const expectedMsg = msg.splice(0, size);

                            res = await chai.request(server)
                                .get(`/api/messages/channel/${channels[i].id}`)
                                .query({ 'pageSize': pageSize, 'page': page })
                                .auth(users[j].token, { type: 'bearer' });
                
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.should.have.length(size);
                            res.body.should.be.eql(expectedMsg);
                        }
                    }
                }
            }
        });
    });
});
