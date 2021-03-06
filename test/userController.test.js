import User from '../server/user/user';
import server from '../server/index';

import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const users = [
    {
        user: {
            username: "admin1",
            password: "admin1",
            email: "admin1@gmail.com",
            firstName: "admin1",
            lastName: "admin1"
        },
        token: ""
    },
    {
        user: {
            username: "admin2",
            password: "admin2",
            email: "admin2@gmail.com",
            firstName: "admin2",
            lastName: "admin2"
        },
        token: ""
    },
    {
        user: {
            username: "admin3",
            password: "admin3",
            email: "admin3@gmail.com",
            firstName: "admin3",
            lastName: "admin3"
        },
        token: ""
    },
];

describe('User', () => {
    after(async () => {
        await User.deleteMany({});
    });

    /*
     * Test the /POST register route
     */
    describe('register', () => {
        it('it should register an user', async () => {
            for (let i = 0; i < users.length; i++) {
                let res = await chai.request(server).post('/api/users/register').send(users[i].user);

                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.not.have.property('error');

                res.body.should.have.property('id');
                res.body.should.have.property('username');
                res.body.should.have.property('firstname');
                res.body.should.have.property('lastname');
                res.body.should.have.property('registerDate');
                res.body.should.have.property('email');
                res.body.should.have.property('channels');
                res.body.should.have.property('online');
                res.body.should.have.property('directMessages');
                res.body.should.have.property('status');

                res.body.username.should.be.eql(users[i].user.username);
                res.body.firstname.should.be.eql(users[i].user.firstName);
                res.body.lastname.should.be.eql(users[i].user.lastName);
                res.body.email.should.be.eql(users[i].user.email);
                res.body.online.should.be.eql(false);
                res.body.channels.should.be.eql([]);
                res.body.directMessages.should.be.eql([]);
                res.body.status.should.be.eql("");
            }
        });

        it('it should not register an username that already exists', async () => {
            let res = await chai.request(server).post('/api/users/register').send(users[0].user);

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Username ${users[0].user.username} already exists`);
        });
    });

    /*
     * Test the /POST login route
     */
    describe('login', () => {
        it('it should login an user', async () => {
            for (let i = 0; i < users.length; i++) {
                let user = {
                    username: users[i].user.username,
                    password: users[i].user.password
                };
                let res = await chai.request(server).post('/api/users/login').send(user);

                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.not.have.property('error');

                res.body.should.have.property('token');
                users[i].token = res.body.token;

                user = await User.findOne({ 'username': users[i].user.username });
                user.should.be.a('object');
                user.should.have.property('online');
                user.online.should.be.eql(true);
            }
        });

        it('it should not login an invalid user', async () => {
            let user = {
                username: "qweasdzxc",
                password: "qweasdzxc"
            };
            let res = await chai.request(server).post('/api/users/login').send(user);

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('username or password is incorrect');
        });
    });

    /*
     * Test the /POST logout route
     */
    describe('logout', () => {
        it('it should logout an user', async () => {
            for (let i = 0; i < users.length; i++) {
                let res = await chai.request(server).post('/api/users/logout')
                    .auth(users[i].token, { type: 'bearer' }).send();

                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.not.have.property('error');

                let user = await User.findOne({ 'username': users[i].user.username });
                user.should.be.a('object');
                user.should.have.property('online');
                user.online.should.be.eql(false);
            }
        });

        it('it should not logout an invalid user', async () => {
            let res = await chai.request(server).post('/api/users/logout').send();

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });
    });

    describe('getAll', () => {
        it('it should get all users', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);

            const res = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('array');

            for (let i = 0; i < users.length; i++) {
                let online = false;
                if (i === 0) {
                    online = true;
                }
                const resUser = res.body[i];

                resUser.should.be.a('object');

                resUser.should.not.have.property('error');

                resUser.should.have.property('id');
                resUser.should.have.property('username');
                resUser.should.have.property('firstname');
                resUser.should.have.property('lastname');
                resUser.should.have.property('registerDate');
                resUser.should.have.property('email');
                resUser.should.have.property('channels');
                resUser.should.have.property('online');
                resUser.should.have.property('directMessages');

                resUser.username.should.be.eql(users[i].user.username);
                resUser.firstname.should.be.eql(users[i].user.firstName);
                resUser.lastname.should.be.eql(users[i].user.lastName);
                resUser.email.should.be.eql(users[i].user.email);
                resUser.online.should.be.eql(online);
                resUser.channels.should.be.eql([]);
                resUser.directMessages.should.be.eql([]);
            }

            await chai.request(server).post('/api/users/logout')
                    .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });

        it('it should not get all users without auth', async () => {
            let res = await chai.request(server).get('/api/users/');

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });
    });

    describe('getByUsername', () => {
        it('it should get an user by username', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);

            for (let i = 0; i < users.length; i++) {
                let online = false;
                if (i === 0) {
                    online = true;
                }

                const res = await chai.request(server).get('/api/users/')
                    .auth(loggedUser.body.token, { type: 'bearer' })
                    .query({ 'username': users[i].user.username });

                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.not.have.property('error');

                res.body.should.have.property('id');
                res.body.should.have.property('username');
                res.body.should.have.property('firstname');
                res.body.should.have.property('lastname');
                res.body.should.have.property('registerDate');
                res.body.should.have.property('email');
                res.body.should.have.property('channels');
                res.body.should.have.property('online');
                res.body.should.have.property('directMessages');
                res.body.should.have.property('status');

                res.body.username.should.be.eql(users[i].user.username);
                res.body.firstname.should.be.eql(users[i].user.firstName);
                res.body.lastname.should.be.eql(users[i].user.lastName);
                res.body.email.should.be.eql(users[i].user.email);
                res.body.online.should.be.eql(online);
                res.body.channels.should.be.eql([]);
                res.body.directMessages.should.be.eql([]);
                res.body.status.should.be.eql("");
            }

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });

        it('it should not get an user by username without auth', async () => {
            let res = await chai.request(server).get('/api/users/')
                .query({ 'username': users[0].user.username });

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not get a non-existent user by username', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);

            const res = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' })
                .query({ 'username': 'qweasdzxc' });

            res.should.have.status(404);
            res.body.should.be.a('object');
    
            res.body.should.have.property('error');
            res.body.error.should.be.eql('User with username qweasdzxc was not found');

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });
    });

    describe('getById', () => {
        it('it should get an user by id', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);
            const allUsers = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' });

            for (let i = 0; i < users.length; i++) {
                let online = false;
                if (i === 0) {
                    online = true;
                }

                const res = await chai.request(server).get(`/api/users/${allUsers.body[i].id}`)
                    .auth(loggedUser.body.token, { type: 'bearer' });

                res.should.have.status(200);
                res.body.should.be.a('object');

                res.body.should.not.have.property('error');

                res.body.should.have.property('id');
                res.body.should.have.property('username');
                res.body.should.have.property('firstname');
                res.body.should.have.property('lastname');
                res.body.should.have.property('registerDate');
                res.body.should.have.property('email');
                res.body.should.have.property('channels');
                res.body.should.have.property('online');
                res.body.should.have.property('directMessages');
                res.body.should.have.property('status');

                res.body.username.should.be.eql(users[i].user.username);
                res.body.firstname.should.be.eql(users[i].user.firstName);
                res.body.lastname.should.be.eql(users[i].user.lastName);
                res.body.email.should.be.eql(users[i].user.email);
                res.body.online.should.be.eql(online);
                res.body.channels.should.be.eql([]);
                res.body.directMessages.should.be.eql([]);
                res.body.status.should.be.eql("");
            }

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });

        it('it should not get an user by id without auth', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);
            const infoUser = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' })
                .query({ 'username': user.username });

            let res = await chai.request(server).get(`/api/users/${infoUser.body.id}`);

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });

        it('it should not get a non-existent user by id', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);

            const res = await chai.request(server).get('/api/users/123')
                .auth(loggedUser.body.token, { type: 'bearer' });

            res.should.have.status(404);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('User with id 123 was not found');

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });
    });

    describe('getCurrent', () => {
        it('it should get current logged user', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);

            const res = await chai.request(server).get('/api/users/authenticated/current')
                .auth(loggedUser.body.token, { type: 'bearer' });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');

            res.body.should.have.property('id');
            res.body.should.have.property('username');
            res.body.should.have.property('firstname');
            res.body.should.have.property('lastname');
            res.body.should.have.property('registerDate');
            res.body.should.have.property('email');
            res.body.should.have.property('channels');
            res.body.should.have.property('online');
            res.body.should.have.property('directMessages');
            res.body.should.have.property('status');

            res.body.username.should.be.eql(users[0].user.username);
            res.body.firstname.should.be.eql(users[0].user.firstName);
            res.body.lastname.should.be.eql(users[0].user.lastName);
            res.body.email.should.be.eql(users[0].user.email);
            res.body.online.should.be.eql(true);
            res.body.channels.should.be.eql([]);
            res.body.directMessages.should.be.eql([]);
            res.body.status.should.be.eql("");

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });

        it('it should not get an user without auth', async () => {
            let res = await chai.request(server).get('/api/users/authenticated/current');

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });
    });

    describe('update', () => {
        it('it should update an user', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const newUser = {
                username: "admin4",
                password: "admin4",
                email: "admin4@gmail.com",
                firstName: "admin4",
                lastName: "admin4",
                status: "admin4"
            };
            let loggedUser = await chai.request(server).post('/api/users/login').send(user);
            let infoUser = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' })
                .query({ 'username': user.username });

            let res = await chai.request(server).put(`/api/users/${infoUser.body.id}`)
                .auth(loggedUser.body.token, { type: 'bearer' }).send(newUser);

            res.should.have.status(204);
            res.body.should.be.empty;

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();

            loggedUser = await chai.request(server).post('/api/users/login')
                .send({ username: newUser.username, password: newUser.password });
            res = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' })
                .query({ 'username': newUser.username });

            res.should.have.status(200);
            res.body.should.be.a('object');

            res.body.should.not.have.property('error');

            res.body.should.have.property('id');
            res.body.should.have.property('username');
            res.body.should.have.property('firstname');
            res.body.should.have.property('lastname');
            res.body.should.have.property('registerDate');
            res.body.should.have.property('email');
            res.body.should.have.property('channels');
            res.body.should.have.property('online');
            res.body.should.have.property('directMessages');
            res.body.should.have.property('status');

            res.body.username.should.be.eql(newUser.username);
            res.body.firstname.should.be.eql(newUser.firstName);
            res.body.lastname.should.be.eql(newUser.lastName);
            res.body.email.should.be.eql(newUser.email);
            res.body.online.should.be.eql(true);
            res.body.channels.should.be.eql([]);
            res.body.directMessages.should.be.eql([]);
            res.body.status.should.be.eql(newUser.status);

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();

            users[0].user = {
                username: "admin4",
                password: "admin4",
                email: "admin4@gmail.com",
                firstName: "admin4",
                lastName: "admin4"
            };
        });

        it('it should not update an user with an existing username', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);
            const infoUser = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' })
                .query({ 'username': user.username });

            let res = await chai.request(server).put(`/api/users/${infoUser.body.id}`)
                .auth(loggedUser.body.token, { type: 'bearer' })
                .send({ 'username': 'admin2' });

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Username "admin2" is already taken');

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });

        it('it should not update an user without auth', async () => {
            let res = await chai.request(server).put('/api/users/123');

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not update other user', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);

            let res = await chai.request(server).put('/api/users/123')
                .auth(loggedUser.body.token, { type: 'bearer' });

            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.be.empty;

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });
    });

    describe('remove', () => {
        it('it should remove an user', async () => {
            const user = {
                username: users[0].user.username,
                password: users[0].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);
            const infoUser = await chai.request(server).get('/api/users/')
                .auth(loggedUser.body.token, { type: 'bearer' })
                .query({ 'username': user.username });

            let res = await chai.request(server).delete(`/api/users/${infoUser.body.id}`)
                .auth(loggedUser.body.token, { type: 'bearer' });

            res.should.have.status(204);

            const mongoUser = await User.findOne({ username: user.username });
            expect(mongoUser).to.be.null;
        });

        it('it should not remove an user without auth', async () => {
            let res = await chai.request(server).delete('/api/users/123');

            res.should.have.status(401);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql('Invalid Token');
        });

        it('it should not remove other user', async () => {
            const user = {
                username: users[1].user.username,
                password: users[1].user.password
            };
            const loggedUser = await chai.request(server).post('/api/users/login').send(user);

            let res = await chai.request(server).delete('/api/users/123')
                .auth(loggedUser.body.token, { type: 'bearer' });

            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.be.empty;

            await chai.request(server).post('/api/users/logout')
                .auth(loggedUser.body.token, { type: 'bearer' }).send();
        });
    });
});
