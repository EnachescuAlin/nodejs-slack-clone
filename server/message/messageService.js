import Message from './message';

class MessageService {
    async add(message) {
        var newMessage = new Message();
        var receiver = {};
        if (message.channelId)
            receiver.channelId = message.channelId;
        else if (message.userId)
            receiver.userId = message.userId;
        Object.assign(newMessage, message, { receiver });
        await newMessage.save();
        return newMessage.toDto();
    }

    async getAll(limit, offset) {
        var query = Message.find();
        if (limit && offset)
            query = query.skip(offset).limit(limit);
        return (await query.sort('-addDate')).map(message => message.toDto());
    }

    async getByChannel(channelId, limit, offset) {
        var query = Message.find({ 'receiver.channelId': channelId });
        if (limit && offset)
            query = query.skip(offset).limit(limit);
        return (await query.sort('-addDate')).map(message => message.toDto());
    }

    async getBySenderAndReceiver(senderId, receiverId, limit, offset) {
        var query = Message.find({ 'receiver.userId': receiverId, 'sender.userId': senderId });
        if (limit && offset)
            query = query.skip(offset).limit(limit);
        return (await query.sort('-addDate')).map(message => message.toDto());
    }
}

export default MessageService;