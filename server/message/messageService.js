import mongoose from 'mongoose';
import Message from './message';
import Channel from '../channel/channel';
import User from '../user/user';
import ForbiddenError from '../errors/forbiddenError';
import NotFoundError from '../errors/notFoundError';
import ProcessEntityError from '../errors/processEntityError';

class MessageService {
    async add(message, sender) {
        if (message.channelId) {
            return await this.addToChannel(message, sender);
        }
        if (message.receiverId) {
            return await this.addToPrivateConversation(message, sender);
        }

        throw new ProcessEntityError('Neither channelId nor receiverId are set');
    }

    async addToChannel(message, sender) {
        var newMessage = new Message();
        var receiver = {};
        var channel = await mongoose.Types.ObjectId.isValid(message.channelId)
            ? await Channel.findById(message.channelId)
            : null;

        if (!channel)
            throw new ProcessEntityError(`Channel with id = ${message.channelId} does not exist`);

        if (await channel.members.filter(elem => elem.equals(sender.userId)).length === 0)
            throw new ForbiddenError(`You are not a member of this channel`);

        receiver.channelId = message.channelId;

        Object.assign(
            newMessage,
            {
                ...message,
                receiver,
                sender
            }
        );

        await newMessage.save();

        return newMessage.toDto();
    }

    async addToPrivateConversation(message, sender) {
        var newMessage = new Message();
        var receiver = {};
        var user = await User.findById(sender.userId);
        var userReceiver = await mongoose.Types.ObjectId.isValid(message.receiverId)
            ? await User.findById(message.receiverId)
            : null;
        if (!userReceiver)
            throw new ProcessEntityError(`You cannot send a direct message to an unknown user`);

        if (await userReceiver.directMessages.filter(x => x.equals(sender.userId)).length === 0) {
            if (!userReceiver.directMessages)
                userReceiver.directMessages = [];

            await userReceiver.directMessages.push(sender.userId);

            await userReceiver.save();
        }

        if (await user.directMessages.filter(x => x.equals(message.receiverId)).length === 0) {
            if (!user.directMessages)
                user.directMessages = [];

            await user.directMessages.push(message.receiverId);

            await user.save();
        }

        receiver.userId = message.receiverId;

        Object.assign(
            newMessage,
            {
                ...message,
                receiver,
                sender
            }
        );

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
        if (! await mongoose.Types.ObjectId.isValid(channelId))
            throw new NotFoundError(`Channel with id = ${channelId} was not found`);

        var query = Message.find({ 'receiver.channelId': channelId });

        if (limit)
            query = query.sort('-addDate').skip(offset).limit(limit);

        return (await query).map(message => message.toDto());
    }

    async getBySenderAndReceiver(senderId, receiverId, limit, offset) {
        if (! await mongoose.Types.ObjectId.isValid(senderId))
            throw new NotFoundError(`Cannot find the sender with id = ${senderId}`);
        if (! await mongoose.Types.ObjectId.isValid(receiverId))
            throw new NotFoundError(`Cannot find the receiver with id = ${receiverId}`);

        var query = Message.find({
            $or: [
                {
                    'receiver.userId': receiverId,
                    'sender.userId': senderId
                },
                {
                    'receiver.userId': senderId,
                    'sender.userId': receiverId
                }
            ]
        });

        if (limit)
            query = query.sort('-addDate').skip(offset).limit(limit);

        return (await query).map(message => message.toDto());
    }
}

export default MessageService;