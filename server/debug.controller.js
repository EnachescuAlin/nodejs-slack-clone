const express = require('express');
const router = express.Router();
const debugService = require('./debug.service');

router.delete('/deleteAllUsers', deleteAllUsers);
router.delete('/deleteAllCounters', deleteAllCounters);

router.get('/getAllUsers', getAllUsers);
router.get('/getAllCounters', getAllCounters);

function deleteAllUsers(req, res, next)
{
    debugService.deleteAllUsers()
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteAllCounters(req, res, next)
{
    debugService.deleteAllCounters()
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllUsers(req, res, next)
{
    debugService.getAllUsers()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllCounters(req, res, next)
{
    debugService.getAllCounters()
        .then(counters => res.json(counters))
        .catch(err => next(err));
}

module.exports = router;
