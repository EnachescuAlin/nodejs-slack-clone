import { Router } from 'express';
const router = Router();

import channelService from './channelService';

router.post('/create', createChannel);

router.get('/', getChannels);
router.get('/byId/:id', getChannelById);

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

export default router;
