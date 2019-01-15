import socketEventEmits from '../sockets';

export const messageActionTypes = {
    GET_MESSAGES_FROM_CHANNEL: "talkpeach/messages/GET_MESSAGES_FROM_CHANNEL",
    CLEAN_MESSAGES: "talkpeach/messages/CLEAN_MESSAGES",
    RECEIVE_MESSAGE_FROM_CHANNEL: "talkpeach/messages/RECEIVE_MESSAGE_FROM_CHANNEL",
}

export const actions = {
    cleanMessages,
    sendMessageToChannel,
    getMessagesFromChannel
}


function getMessagesFromChannel() {
    return dispatch => {
        socketEventEmits.newMessageToChannel(message => {
            dispatch({
                type: messageActionTypes.RECEIVE_MESSAGE_FROM_CHANNEL,
                message
            })
        });
        socketEventEmits.receiveAllMessagesFromChannel((messages) => {
            dispatch({
                type: messageActionTypes.GET_MESSAGES_FROM_CHANNEL,
                messages
            });
        }); 
    }
}

function sendMessageToChannel(channelId, message, sender) {
    return dispatch => {
        socketEventEmits.sendMessageToChannel(channelId, message, sender);
    }
}

function cleanMessages() { 
    return dispatch => {
        dispatch({
            type: messageActionTypes.CLEAN_MESSAGES
        });
    }
}

const initialState = {
    messages: []
}

export default function chat(state = initialState, action) {
    switch (action.type) {
        case messageActionTypes.GET_MESSAGES_FROM_CHANNEL:
            return {
                ...state,
                messages: [
                    ...action.messages
                ]
            }
        case messageActionTypes.CLEAN_MESSAGES:
            return {
                ...state,
                messages: []
            }
        case messageActionTypes.RECEIVE_MESSAGE_FROM_CHANNEL:
            return {
                ...state,
                messages: [
                    ...state.messages.filter(m => m.id !== action.message.id),
                    action.message
                ]
            }
        default:
            return state;
    }
}