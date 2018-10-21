const express = require('express');
const router = express.Router();
const userService = require('./users.service');

router.post('/register', register);
router.post('/login', login);

router.get('/getAll', getAll);
router.get('/getById/:userId', getById);
router.get('/getByUsername/:username', getByUsername);
router.get('/logout', logout);
router.get('/getCurrent', getCurrent);

router.put('/changeFirstName', changeFirstName);
router.put('/changeLastName', changeLastName);
router.put('/changePassword', changePassword);

function register(req, res, next)
{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    userService.createUser(username, password, email, firstname, lastname)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function login(req, res, next)
{
    const username = req.body.username;
    const password = req.body.password;
    userService.login(username, password)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function logout(req, res, next)
{
    userService.logout(req.user.sub)
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

function getCurrent(req, res, next)
{
    const userId = req.user.sub;
    userService.getById(userId)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function changeFirstName(req, res, next)
{
    const userId = req.user.sub;
    const newFirstName = req.body.newFirstName;
    userService.changeFirstName(userId, newFirstName)
        .then(() => res.json({}))
        .catch(err => ext(err));
}

function changeLastName(req, res, next)
{
    const userId = req.user.sub;
    const newLastName = req.body.newLastName;
    userService.changeLastName(userId, newLastName)
        .then(() => res.json({}))
        .catch(err => ext(err));
}

function changePassword(req, res, next)
{
    const userId = req.user.sub;
    const newPassword = req.body.newPassword;
    userService.changePassword(userId, newPassword)
        .then(() => res.json({}))
        .catch(err => ext(err));
}

module.exports = router;
