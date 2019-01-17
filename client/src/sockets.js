import io from 'socket.io-client';

const socketChannels = io.connect('http://localhost:3000');

const subscribeToChannel = (channelId) => {
    socketChannels.emit('subscribe', channelId);
}

const connectUser = (userId) => {
    socketChannels.emit('connectUser', userId);
}

const unSubscribeFromChannel = (channelId) => {
    socketChannels.emit('unsubscribe', channelId);
}

const sendMessageToChannel = (channelId, message, sender) => {
    socketChannels.emit('sendToChannel', { room: channelId, message, sender });
}

const sendMessageToUser = (message, sender) => {
    socketChannels.emit('sendToUser', { message, sender });
}

const getPageOfMessagesFromChannel = (channelId, page, pageSize) => {
    socketChannels.emit('getMessagesFromChannel', { channelId, page, pageSize });
}

const getAllMessagesFromChannel = (channelId) => {
    socketChannels.emit('getAllMessagesFromChannel', channelId);
}

const getAllMessagesFromUser = ({senderId, receiverId}) => {
    socketChannels.emit('getAllMessagesBySenderAndReceiver', {senderId, receiverId});
}

const newMessageToChannel = (onNewMessageAdded) => {
    socketChannels.once('newMessageToChannel', onNewMessageAdded);
}

const newMessageToUser = (onNewMessageAdded) => {
    socketChannels.once('newMessageToUser', onNewMessageAdded);
}

const receiveMessagesFromChannel = (onReceiveMessages) => {
    socketChannels.once('receiveMessages', onReceiveMessages);
}

const receiveAllMessagesFromChannel = (onReceiveMessages) => {
    socketChannels.once('receiveAllMessages', onReceiveMessages);
}

const receiveAllMessagesFromUser = (onReceiveMessages) => {
    socketChannels.once('receiveAllMessagesBySenderAndReceiver', onReceiveMessages);
}

export default {
    subscribeToChannel,
    unSubscribeFromChannel,
    sendMessageToChannel,
    getPageOfMessagesFromChannel,
    getAllMessagesFromChannel,
    newMessageToChannel,
    receiveMessagesFromChannel,
    receiveAllMessagesFromChannel,
    connectUser,
    sendMessageToUser,
    getAllMessagesFromUser,
    newMessageToUser,
    receiveAllMessagesFromUser
}