import MessageService from '../message/messageService';

const messageService = new MessageService();

export default (io) => (socket) => {
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
}