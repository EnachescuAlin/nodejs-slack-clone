import { Router } from 'express';
const router = Router();

import ChannelService from './channelService';

const channelService = new ChannelService();

router.post('/', createChannel);
router.post('/:id/participants', join);
router.post('/:id/participants/:guestId', invite);

router.get('/', (req, _, next) => next(req.query.name ? null : 'route'), getChannelsByName);
router.get('/', (req, _, next) => next(req.query.participantId ? null : 'route'), getChannelByParticipant);
router.get('/', (req, _, next) => next(req.query.public ? null : 'route'), getChannelsByIsPublic);
router.get('/', getChannels);
router.get('/:id', getChannelById);
router.get('/:id/participants', getParticipants);

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

function getChannelsByIsPublic(req, res, next)
{
    channelService.getByIsPublic(req.query.public)
        .then(channels => res.json(channels))
        .catch(err => next(err));
}

function getChannelsByName(req, res, next)
{
    channelService.getByName(req.query.name, req.query.public)
        .then(channels => res.json(channels))
        .catch(err => next(err));
}

function getChannels(_, res, next)
{
    channelService.getAll()
        .then(channels => res.json(channels))
        .catch(err => next(err));
}

function getChannelById(req, res, next)
{
    const channelId = req.params.id;
    const userId = req.user.sub;
    channelService.getById(channelId, userId)
        .then(channel => res.json(channel))
        .catch(err => next(err));
}

function join(req, res, next)
{
    const channelId = req.params.id;
    const userId = req.user.sub;
    channelService.join(channelId, userId)
        .then(() => res.status(204).send())
        .catch(err => next(err));
}

function invite(req, res, next)
{
    const channelId = req.params.id;
    const guestId = req.params.guestId;
    const userId = req.user.sub;
    channelService.invite(channelId, userId, guestId)
        .then(() => res.status(204).send())
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
    channelService.update(channelId, channel, userId)
        .then((updatedChannel) => res.status(200).json(updatedChannel))
        .catch(err => next(err));
}

function getChannelByParticipant(req, res, next)
{
    const participantId = req.query.participantId;
    channelService.getByParticipantId(participantId)
        .then(channels => res.json(channels))
        .catch(err => next(err));
}

function getParticipants(req, res, next)
{
    const channelId = req.params.id;
    channelService.getMembers(channelId)
        .then(users => res.json(users))
        .catch(err => next(err)); 
}

export default router;
