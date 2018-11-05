import Channel from './channel';
import User from '../user/user';
import mongoose, {
    ValidationError
} from 'mongoose';
import NotFoundError from '../errors/notFoundError';
import ForbiddenError from '../errors/forbiddenError';

export default class ChannelService {

    async createChannel(name, description, isPublic, createdBy) {
        const existingChannel = await Channel.findOne({
            'name': name
        });
        if (existingChannel) {
            throw new ValidationError(`Name ${name} already exists`);
        }

        const newChannel = new Channel();
        newChannel.name = name;
        newChannel.description = description;
        newChannel.isPublic = isPublic;
        newChannel.createdBy = createdBy;
        newChannel.members = [createdBy];

        await newChannel.save();

        await User.findByIdAndUpdate(createdBy, {
            $push: {
                channels: newChannel.id
            }
        });

        return newChannel.toDto();
    }

    async getPublicChannels() {
        return (await Channel.find({
            isPublic: true
        })).map(channel => channel.toDto());
    }

    async getChannelById(channelId, userId) {
        const channel = mongoose.Types.ObjectId.isValid(channelId) ? await Channel.findOne({
            '_id': channelId
        }) : null;
        if (!channel) {
            throw new NotFoundError(`Channel with id = ${channelId} was not found`);
        }
        if (channel.isPublic === false && !await channel.members.find(obj => obj.equals(userId))) {
            throw new ForbiddenError('Not allowed to view this channel');
        }
        return channel.toDto();
    }

    async join(channelId, userId) {
        const channel = mongoose.Types.ObjectId.isValid(channelId) ? await Channel.findById(channelId) : null;
        if (!channel) {
            throw new NotFoundError(`Channel with id = ${channelId} was not found`);
        }
        if (channel.isPublic === false) {
            throw new ForbiddenError('Not allowed to join this channel');
        }

        const user = mongoose.Types.ObjectId.isValid(userId) ? await User.findById(userId) : null;
        if (!user) {
            throw new NotFoundError(`User with id = ${userId} was not found`);
        }

        if (await channel.members.find(obj => obj.equals(userId))) {
            throw new ValidationError('You already joined this channel');
        }

        await user.channels.push(channelId);
        await channel.members.push(userId);
        await user.save();
        await channel.save();
    }

    async invite(channelId, userId, guestId) {
        if (userId.equals(guestId)) {
            throw new ValidationError('You cannot invite yourself');
        }

        const channel = mongoose.Types.ObjectId.isValid(channelId) ? await Channel.findById(channelId) : null;
        if (!channel) {
            throw new NotFoundError(`Channel with id = ${channelId} was not found`);
        }

        const user = mongoose.Types.ObjectId.isValid(userId) ? await User.findById(userId) : null;
        if (!user) {
            throw new NotFoundError(`User with id = ${userId} was not found`);
        }

        const guest = mongoose.Types.ObjectId.isValid(guestId) ? await User.findById(guestId) : null;
        if (!guest) {
            throw new NotFoundError(`Guest with id = ${guestId} was not found`);
        }

        if (!await channel.members.find(obj => obj.equals(userId))) {
            throw new ValidationError('You cannot invite users in this channel');
        }

        if (await channel.members.find(obj => obj.equals(guestId))) {
            throw new ValidationError('Guest already joined this channel');
        }

        await guest.channels.push(channelId);
        await channel.members.push(guestId);
        await guest.save();
        await channel.save();
    }

    async kickout(channelId, userId, memberId) {
        const channel = mongoose.Types.ObjectId.isValid(channelId) ? await Channel.findById(channelId) : null;
        if (!channel) {
            throw new NotFoundError(`Channel with id = ${channelId} was not found`);
        }

        const user = mongoose.Types.ObjectId.isValid(userId) ? await User.findById(userId) : null;
        if (!user) {
            throw new NotFoundError(`User with id = ${userId} was not found`);
        }

        const member = mongoose.Types.ObjectId.isValid(userId) ? await User.findById(memberId) : null;
        if (!member) {
            throw new NotFoundError(`Member with id = ${memberId} was not found`);
        }

        if (!await channel.members.find(obj => obj.equals(userId))) {
            throw new ValidationError('You have not joined this channel');
        }

        if (!await channel.members.find(obj => obj.equals(memberId))) {
            throw new ValidationError(`Member with id = ${memberId} has not joined this channel`);
        }

        if (channel.createdBy.equals(memberId)) {
            throw new ValidationError('You cannot kickout the owner of the channel');
        }

        if (!channel.createdBy.equals(userId)) {
            throw new ForbiddenError('You have no permission to kickout members');
        }

        member.channels = await member.channels.filter(obj => !obj.equals(channelId));
        channel.members = await channel.members.filter(obj => !obj.equals(memberId));

        await member.save();
        await channel.save();
    }

    async update(channelId, channel, userId) {
        const existingChannel = mongoose.Types.ObjectId.isValid(channelId) ? await Channel.findById(channelId) : null;
        if (!existingChannel) throw new NotFoundError(`Channel with id = ${channelId} was not found`);
        if (!existingChannel.createdBy.equals(userId)) {
            throw new ForbiddenError('You cannot update channel');
        }
        if (existingChannel.name !== channel.name && await User.findOne({
                name: channel.name
            })) {
            throw new ValidationError(`This name is already taken`);
        }
        Object.assign(existingChannel, channel);

        await existingChannel.save();
    }
}