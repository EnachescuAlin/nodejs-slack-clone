import { Router } from 'express';
const router = Router();

import channelService from './channelService';

router.post('/create', createChannel);

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

export default router;
