import User from '../server/user/user';
import server from '../server/index';

import chai from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();

chai.use(chaiHttp);

const users = [
    {
        username: "admin1",
        password: "admin1",
        email: "admin1@gmail.com",
        firstName: "admin1",
        lastName: "admin1"
    },
    {
        username: "admin2",
        password: "admin2",
        email: "admin2@gmail.com",
        firstName: "admin2",
        lastName: "admin2"
    },
    {
        username: "admin3",
        password: "admin3",
        email: "admin3@gmail.com",
        firstName: "admin3",
        lastName: "admin3"
    },
];

describe('User', () => {
    before(async () => {
        await User.deleteMany({}, async (err) => {
            if (err) {
                await console.log('could not delete the old users');
            }
        });
    });

    /*
     * Test the /POST register route
     */
    describe('register', () => {
        it('it should register an user', async () => {
            let res;
            for (let i = 0; i < users.length; i++) {
                res = await chai.request(server).post('/api/users/register').send(users[i]);

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

                res.body.username.should.be.eql(users[i].username);
                res.body.firstname.should.be.eql(users[i].firstName);
                res.body.lastname.should.be.eql(users[i].lastName);
                res.body.email.should.be.eql(users[i].email);
                res.body.online.should.be.eql(false);
                res.body.channels.should.be.eql([]);
                res.body.directMessages.should.be.eql([]);
            }

            res = await chai.request(server).post('/api/users/register').send(users[0]);

            res.should.have.status(422);
            res.body.should.be.a('object');

            res.body.should.have.property('error');
            res.body.error.should.be.eql(`Username ${users[0].username} already exists`);
        });
    });

    /*
     * Test the /POST login route
     */
    describe('login', () => {
        it('it should login an user', async () => {
        });
    });
});
