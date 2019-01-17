import socketEventEmits from '../sockets';

export const messageActionTypes = {
    GET_MESSAGES_FROM_CHANNEL: "talkpeach/messages/GET_MESSAGES_FROM_CHANNEL",
    CLEAN_MESSAGES: "talkpeach/messages/CLEAN_MESSAGES",
    CLEAN_PRIVATE_MESSAGES: "talkpeach/messages/CLEAN_PRIVATE_MESSAGES",
    RECEIVE_MESSAGE_FROM_CHANNEL: "talkpeach/messages/RECEIVE_MESSAGE_FROM_CHANNEL",
    GET_MESSAGES_FROM_USER: "talkpeach/messages/GET_MESSAGES_FROM_USER",
    RECEIVE_MESSAGE_FROM_USER: "talkpeach/messages/RECEIVE_MESSAGE_FROM_USER"
}

export const actions = {
    cleanMessages,
    cleanPrivateMessages,
    sendMessageToChannel,
    getMessagesFromChannel,
    getMessagesFromUser,
    sendMessageToUser
}


function getMessagesFromChannel(channelId) {
    return dispatch => {
        socketEventEmits.newMessageToChannel(message => {
            dispatch({
                type: messageActionTypes.RECEIVE_MESSAGE_FROM_CHANNEL,
                message,
                channelId: message.receiver.channelId
            });
        });
        socketEventEmits.receiveAllMessagesFromChannel((messages) => {
            dispatch({
                type: messageActionTypes.GET_MESSAGES_FROM_CHANNEL,
                messages,
                channelId
            });
        }); 
    }
}

function getMessagesFromUser() {
    return dispatch => {
        socketEventEmits.newMessageToUser(({message, userId}) => {
            dispatch({
                type: messageActionTypes.RECEIVE_MESSAGE_FROM_USER,
                message,
                userId
            });
        });
        socketEventEmits.receiveAllMessagesFromUser(({messages, userId}) => {
            dispatch({
                type: messageActionTypes.GET_MESSAGES_FROM_USER,
                messages,
                userId
            });
        })
    }
}

function sendMessageToChannel(channelId, message, sender) {
    return _ => {
        socketEventEmits.sendMessageToChannel(channelId, message, sender);
    }
}

function sendMessageToUser(message, sender) {
    return _ => {
        socketEventEmits.sendMessageToUser(message, sender);
    }
}

function cleanMessages(channelId) { 
    return dispatch => {
        dispatch({
            type: messageActionTypes.CLEAN_MESSAGES,
            channelId
        });
    }
}

function cleanPrivateMessages(userId) {
    return dispatch => {
        dispatch({
            type: messageActionTypes.CLEAN_PRIVATE_MESSAGES,
            userId
        });
    }
}

const initialState = {
    channels: { },
    private: { }
}

export default function chat(state = initialState, action) {
    switch (action.type) {
        case messageActionTypes.GET_MESSAGES_FROM_CHANNEL:
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.channelId]: {
                        messages: [
                            ...action.messages
                        ]
                    }
                }
            }
        case messageActionTypes.GET_MESSAGES_FROM_USER:
            return {
                ...state,
                private: {
                    ...state.private,
                    [action.userId]: {
                        messages: [
                            ...action.messages
                        ]
                    }
                }
            }
        case messageActionTypes.CLEAN_MESSAGES:
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.channelId]: {
                        messages: []
                    }
                }
            }
        case messageActionTypes.CLEAN_PRIVATE_MESSAGES:
            return {
                ...state,
                private: {
                    ...state.private,
                    [action.userId]: {
                        messages: []
                    }
                }
            }
        case messageActionTypes.RECEIVE_MESSAGE_FROM_CHANNEL:
            var currentMessages = state.channels[action.channelId] ? state.channels[action.channelId].messages : [];
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.channelId]: {
                        messages: [
                            ...currentMessages.filter(m => m.id !== action.message.id),
                            action.message
                        ]
                    }
                }
            }
        case messageActionTypes.RECEIVE_MESSAGE_FROM_USER:
            var currentMessages = state.private[action.userId] ? state.private[action.userId].messages: [];
            return {
                ...state,
                private: {
                    ...state.private,
                    [action.userId]: {
                        messages: [
                            ...currentMessages.filter(m => m.id !== action.message.id),
                            action.message
                        ]
                    }
                }
            }
        default:
            return state;
    }
}