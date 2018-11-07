import mongoose from 'mongoose';
import Message from './message';
import Channel from '../channel/channel';
import User from '../user/user';
import ForbiddenError from '../errors/forbiddenError';
import NotFoundError from '../errors/notFoundError';
import ProcessEntityError from '../errors/processEntityError';

class MessageService {
    async add(message, sender) {
        var newMessage = new Message();
        var receiver = {};
        if (message.channelId) {
            var channel = mongoose.Types.ObjectId.isValid(message.channelId) ? await Channel.findById(message.channelId) : null;
            if (!channel)
                throw new ProcessEntityError(`Channel with id = ${message.channelId} does not exist`);
            if (channel.members.filter(elem => elem.equals(sender.userId)).length == 0)
                throw new ForbiddenError(`You are not a member of this channel`);
            receiver.channelId = message.channelId;
        } else if (message.receiverId) {
            var user = User.findById(sender.userId);
            var userReceiver = mongoose.Types.ObjectId.isValid(message.receiverId) ? await User.findById(message.receiverId) : null;
            if (userReceiver)
                throw new ProcessEntityError(`You cannot send a direct message to an unknown user`);
            if (userReceiver.directMessages.filter(x => x.equals(message.receiverId)).length == 0) {
                userReceiver.directMessages.push(sender.userId);
                user.directMessages.push(message.receiverId);
                await userReceiver.save();
                await user.save();
            }
            receiver.userId = message.receiverId;
        }
        Object.assign(newMessage, { ...message,
            receiver,
            sender
        });
        await newMessage.save();
        return newMessage.toDto();
    }

    async getAll(limit, offset) {
        var query = Message.find().sort('-addDate');
        if (limit)
            query = query.skip(offset).limit(limit);
        return (await query).map(message => message.toDto());
    }

    async getByChannel(channelId, limit, offset) {
        if (!mongoose.Types.ObjectId.isValid(channelId))
            throw new NotFoundError(`Channel with id = ${channelId} was not found`);
        var query = Message.find({
            'receiver.channelId': channelId
        }).sort('-addDate');
        if (limit)
            query = query.skip(offset).limit(limit);
        return (await query).map(message => message.toDto());
    }

    async getBySenderAndReceiver(senderId, receiverId, limit, offset) {
        if (!mongoose.Types.ObjectId.isValid(senderId))
            throw new NotFoundError(`Cannot find the sender with id = ${senderId}`);
        if (!mongoose.Types.ObjectId.isValid(receiverId))
            throw new NotFoundError(`Cannot find the receiver with id = ${receiverId}`);
        var query = Message.find({
            'receiver.userId': receiverId,
            'sender.userId': senderId
        }).sort('-addDate');
        if (limit)
            query = query.skip(offset).limit(limit);
        return (await query).map(message => message.toDto());
    }
}

export default MessageService;