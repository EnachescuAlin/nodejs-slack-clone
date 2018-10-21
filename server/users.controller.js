const express = require('express');
const router = express.Router();
const userService = require('./users.service');

router.post('/register', register);

router.get('/getAll', getAll);
router.get('/getById/:userId', getById);
router.get('/getByUsername/:username', getByUsername);

function register(req, res, next)
{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    userService.createUser(username, password, email)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next)
{
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next)
{
    const userId = req.params.userId;
    userService.getById(userId)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function getByUsername(req, res, next)
{
    const username = req.params.username;
    userService.getByUsername(username)
        .then(user => res.json(user))
        .catch(err => next(err));
}

module.exports = router;
