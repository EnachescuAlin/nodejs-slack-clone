import MessageService from '../message/messageService';

const messageService = new MessageService();

const connectedUsers = {};

export default (io) => (socket) => {
    socket.on('connectUser', userId => {
        connectedUsers[userId] = socket.id;
    });

    socket.on('subscribe', channelId => { 
        socket.join(channelId); 
    });

    socket.on('unsubscribe', channelId => {  
        socket.leave(channelId); 
    });

    socket.on('sendToChannel', async ({ message, room, sender }) => {
        var newMessage = await messageService.add(message, sender);
        io.in(room).emit('newMessageToChannel', newMessage);
    });

    socket.on('getMessagesFromChannel', async ({ channelId, page, pageSize }) => {
        var messages = await messageService.getByChannel(channelId, pageSize, (page - 1) * pageSize);
        socket.emit('receiveMessages', messages);
    });

    socket.on('getAllMessagesFromChannel', async (channelId) => {
        var messages = await messageService.getByChannel(channelId);
        socket.emit('receiveAllMessages', messages);
    });

    socket.on('sendToUser', async ({message, sender}) => {
        var newMessage = await messageService.add(message, sender);
        io.sockets.connected[connectedUsers[message.receiverId]].emit('newMessageToUser', { message: newMessage, userId: sender.userId });
        socket.emit('newMessageToUser', {message: newMessage, userId: message.receiverId});
    });

    socket.on('getAllMessagesBySenderAndReceiver', async ({senderId, receiverId}) => {
        var messages = await messageService.getBySenderAndReceiver(senderId, receiverId);
        socket.emit('receiveAllMessagesBySenderAndReceiver', {messages, userId: receiverId});
    });
}