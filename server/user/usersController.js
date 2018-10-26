import { Router } from 'express';
const router = Router();
import userService from './userService';

router.post('/register', register);
router.post('/login', login);

router.get('/', getAll);
router.get('/:userId', getById);
router.get('/getByUsername/:username', getByUsername);
router.get('/logout', logout);
router.get('/current', getCurrent);

function register(req, res, next)
{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    userService.createUser({username, password, email, firstname, lastname})
        .then((newUser) => res.json(newUser))
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

export default router;
