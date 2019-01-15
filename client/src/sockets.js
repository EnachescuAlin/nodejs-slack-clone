import io from 'socket.io-client';

const socketChannels = io.connect('http://localhost:3000');

const subscribeToChannel = (channelId) => {
    socketChannels.emit('subscribe', channelId);
}

const unSubscribeFromChannel = (channelId) => {
    socketChannels.emit('unsubscribe', channelId);
}

const sendMessageToChannel = (channelId, message, sender) => {
    socketChannels.emit('sendToChannel', { room: channelId, message, sender });
}

const getPageOfMessagesFromChannel = (channelId, page, pageSize) => {
    socketChannels.emit('getMessagesFromChannel', { channelId, page, pageSize });
}

const getAllMessagesFromChannel = (channelId) => {
    socketChannels.emit('getAllMessagesFromChannel', channelId);
}

const newMessageToChannel = (onNewMessageAdded) => {
    socketChannels.on('newMessageToChannel', onNewMessageAdded);
}

const receiveMessagesFromChannel = (onReceiveMessages) => {
    socketChannels.on('receiveMessages', onReceiveMessages);
}

const receiveAllMessagesFromChannel = (onReceiveMessages) => {
    socketChannels.on('receiveAllMessages', onReceiveMessages);
}

export default {
    subscribeToChannel,
    unSubscribeFromChannel,
    sendMessageToChannel,
    getPageOfMessagesFromChannel,
    getAllMessagesFromChannel,
    newMessageToChannel,
    receiveMessagesFromChannel,
    receiveAllMessagesFromChannel
}