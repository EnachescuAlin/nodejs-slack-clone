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
        pageSize = req.query.pageSize;
        offset = (req.query.page - 1) * req.query.pageSize;
    }
    if (req.query.receiverId && req.query.senderId)
        messageService.getBySenderAndReceiver(req.query.senderId, req.query.receiverId, pageSize, offset)
            .then(messages => res.json(messages.map(message => message.toDto())))
            .catch(err => next(err));
    else
        messageService.getAll(pageSize, offset)
            .then(messages => res.json(messages.map(message => message.toDto())))
            .catch(err => next(err));
}

function getByChannel(req, res, next) {
    var pageSize = null, offset = null;
    if (req.query.pageSize && req.query.page) {
        pageSize = req.query.pageSize;
        offset = (req.query.page - 1) * req.query.pageSize;
    }
    messageService.getByChannel(req.params.channelId, pageSize, offset)
        .then(messages => res.json(messages.map(message => message.toDto())))
        .catch(err => next(err));
}

function addNewMessage(req, res, next) {
    var message = req.body;
    messageService.add(message)
        .then(newMessage => res.json(newMessage))
        .catch(err => next(err));
}

export default router;