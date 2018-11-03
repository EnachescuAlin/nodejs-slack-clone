import { Router } from 'express';
const router = Router();

import channelService from './channelService';

router.post('/create', createChannel);
router.post('/join/:id', join);
router.post('/leave/:id', leave);
router.post('/invite/:id/:userId', invite);
router.post('/kickout/:id/:userId', kickout);

router.get('/', getChannels);
router.get('/byId/:id', getChannelById);

router.put('/changeDescription/:id', changeDescription);

function createChannel(req, res, next)
{
    const name = req.body.name;
    const description = req.body.description;
    const isPublic = req.body.isPublic;
    const createdBy = req.user.sub;
    channelService.createChannel(name, description, isPublic, createdBy)
        .then(newChannel => res.json(newChannel))
        .catch(err => next(err));
}

function getChannels(req, res, next)
{
    channelService.getPublicChannels()
        .then(channels => res.json(channels))
        .catch(err => next(err));
}

function getChannelById(req, res, next)
{
    const channelId = req.params.id;
    const userId = req.user.sub;
    channelService.getChannelById(channelId, userId)
        .then(channel => res.json(channel))
        .catch(err => next(err));
}

function join(req, res, next)
{
    const channelId = req.params.id;
    const userId = req.user.sub;
    channelService.join(channelId, userId)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function leave(req, res, next)
{
    const channelId = req.params.id;
    const userId = req.user.sub;
    channelService.leave(channelId, userId)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function invite(req, res, next)
{
    const channelId = req.params.id;
    const guestId = req.params.userId;
    const userId = req.user.sub;
    channelService.invite(channelId, userId, guestId)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function kickout(req, res, next)
{
    const channelId = req.params.id;
    const memberId = req.params.userId;
    const userId = req.user.sub;
    channelService.kickout(channelId, userId, memberId)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function changeDescription(req, res, next)
{
    const channelId = req.params.id;
    const userId = req.user.sub;
    const newDescription = req.body.description;
    channelService.changeDescription(channelId, userId, newDescription)
        .then(() => res.json({}))
        .catch(err => next(err));
}

export default router;
