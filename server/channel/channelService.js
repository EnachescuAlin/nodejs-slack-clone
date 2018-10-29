import Channel from './channel';
import User from '../user/user';

async function createChannel(name, description, isPublic, createdBy)
{
    const existingChannel = await Channel.findOne({ 'name': name });
    if (existingChannel) {
        throw 'Name "' + name + '" already exists';
    }

    const newChannel = new Channel();
    newChannel.name = name;
    newChannel.description = description;
    newChannel.isPublic = isPublic;
    newChannel.createdBy = createdBy;
    newChannel.members = [ createdBy ];

    await newChannel.save();

    await User.findByIdAndUpdate(createdBy, { $push: { channels: newChannel.id }});

    return newChannel.toDto();
}

async function getPublicChannels()
{
    return (await Channel.find({ isPublic: true })).map(channel => channel.toDto());
}

async function getChannelById(channelId, userId)
{
    const channel = await Channel.findOne({
        '_id': channelId
    });
    if (!channel) {
        throw 'not found channel with id = ' + channelId;
    }
    if (channel.isPublic === false && !channel.members.find(obj => obj === userId)) {
        throw 'not allowed';
    }
    return channel.toDto();
}

async function join(channelId, userId)
{
    const channel = await Channel.findById(channelId);
    if (!channel) {
        throw 'not found channel with id = ' + channelId;
    }
    if (channel.isPublic === false) {
        throw 'not allowed';
    }

    const user = await User.findById(userId);
    if (!user) {
        throw 'not found user with id = ' + userId;
    }

    if (await channel.members.find(obj => obj.equals(userId))) {
        throw 'user is already joined';
    }

    await user.channels.push(channelId);
    await channel.members.push(userId);

    await user.save();
    await channel.save();
}

export default {
    createChannel,
    getPublicChannels,
    getChannelById,
    join
};
