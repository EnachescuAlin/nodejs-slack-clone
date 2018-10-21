const express = require('express');
const router = express.Router();
const userService = require('./users.service');

router.post('/register', register);

function register(req, res, next)
{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    userService.createUser(username, password, email)
        .then(() => res.json({}))
        .catch(err => next(err));
}

module.exports = router;
