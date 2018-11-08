import {
    Router
} from 'express';
const router = Router();

import MessageService from './messageService';

const messageService = new MessageService();

router.get('/', getMessages);
router.get('/channel/:channelId', getByChannel);

router.post('/', addNewMessage);

function getMessages(req, res, next) {
    var pageSize = null, offset = null;
    if (req.query.pageSize && req.query.page) {
        pageSize = parseInt(req.query.pageSize);
        offset = (parseInt(req.query.page) - 1) * pageSize;
    }
    if (req.query.receiverId && req.query.senderId)
        messageService.getBySenderAndReceiver(req.query.senderId, req.query.receiverId, pageSize, offset)
            .then(messages => res.json(messages))
            .catch(err => next(err));
    else
        messageService.getAll(pageSize, offset)
            .then(messages => res.json(messages))
            .catch(err => next(err));
}

function getByChannel(req, res, next) {
    var pageSize = null, offset = null;
    if (req.query.pageSize && req.query.page) {
        pageSize = parseInt(req.query.pageSize);
        offset = (parseInt(req.query.page) - 1) * pageSize;
    }
    messageService.getByChannel(req.params.channelId, pageSize, offset)
        .then(messages => res.json(messages))
        .catch(err => next(err));
}

function addNewMessage(req, res, next) {
    var message = {
        text: req.body.text,
        receiverId: req.body.receiverId,
        channelId: req.body.channelId
    };
    messageService.add(message, { userId: req.user.sub, username: req.user.name })
        .then(newMessage => res.json(newMessage))
        .catch(err => next(err));
}

export default router;