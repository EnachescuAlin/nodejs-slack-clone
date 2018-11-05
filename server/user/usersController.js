import {
    Router
} from 'express';
const router = Router();
import UserService from './userService';

const userService = new UserService();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/', get);
router.get('/:id', getById);
router.get('/authenticated/current', getCurrent);

router.put('/:id', update);

router.delete('/:id', remove);

function register(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    userService.createUser({
            username,
            password,
            email,
            firstname,
            lastname
        })
        .then((newUser) => res.json(newUser))
        .catch(err => next(err));
}

function login(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    userService.login(username, password)
        .then(token => res.json(token))
        .catch(err => next(err));
}

function logout(req, res, next) {
    userService.logout(req.user.sub)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function get(req, res, next) {
    const username = req.query.username;
    if (!username)
        userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
    else
        userService.getByUsername(username)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const userId = req.params.id;
    userService.getById(userId)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    const userId = req.user.sub;
    userService.getById(userId)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function update(req, res, next) {
    const userId = req.params.id;
    const currentUser = req.user.sub;
    if (userId != currentUser)
        res.status(401).send();
    else {
        var user = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            email: req.body.email,
            status: req.body.status
        }
        userService.update(userId, user)
            .then(() => res.status(204).send())
            .catch(err => next(err));
    }
}

function remove(req, res, next) {
    const userId = req.params.id;
    const currentUser = req.user.sub;
    if (userId != currentUser)
        res.status(401).send();
    else
        userService.remove(userId)
            .then(() => res.status(204).send())
            .catch(err => next(err));
}

export default router;