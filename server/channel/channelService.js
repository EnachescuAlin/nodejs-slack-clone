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

export default {
    createChannel
};
