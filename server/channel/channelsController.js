import { Router } from 'express';
const router = Router();

import ChannelService from './channelService';

const channelService = new ChannelService();

router.post('/', createChannel);
router.post('/:id/participants', join);
router.post('/:id/invitations', invite);

router.get('/', getChannels);
router.get('/:id', getChannelById);

router.put('/:id', update);

router.delete('/:id/participants/:userId', kickout);

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
        .then(() => res.status(204).json({}))
        .catch(err => next(err));
}

function invite(req, res, next)
{
    const channelId = req.params.id;
    const guestId = req.body.receiverId;
    const userId = req.user.sub;
    channelService.invite(channelId, userId, guestId)
        .then(() => res.status(204).json({}))
        .catch(err => next(err));
}

function kickout(req, res, next)
{
    const channelId = req.params.id;
    const memberId = req.params.userId;
    const userId = req.user.sub;
    channelService.kickout(channelId, userId, memberId)
        .then(() => res.status(204).json({}))
        .catch(err => next(err));
}

function update(req, res, next)
{
    const channelId = req.params.id;
    const userId = req.user.sub;
    const channel = {
        name: req.body.name,
        description: req.body.description,
        isPublic: req.body.isPublic
    };
    Object.keys(channel).forEach(key => channel[key] === undefined && delete channel[key]);
    channelService.update(channelId, channel,userId)
        .then(() => res.status(204).json({}))
        .catch(err => next(err));
}

export default router;
