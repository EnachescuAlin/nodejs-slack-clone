import ChannelService from './channelService';

export const channelActionTypes = {
    GET_CHANNELS: "talkpeach/channels/GET_CHANNELS",
    SELECT_CHANNEL: "talkpeach/channels/SELECT_CHANNEL",
    ADD_CHANNEL: "talkpeach/channels/ADD_CHANNEL",
    UPDATE_CHANNEL: "talkpeach/channels/UPDATE_CHANNEL",
    ADD_PARTICIPANT: "talkpeach/channels/ADD_PARTICIPANT",
    REMOVE_PARTICIPANT: "talkpeach/channels/REMOVE_PARTICIPANT",
    AUTHORIZATION_ERROR: "talkpeach/channels/AUTHORIZATION_ERROR",
    VALIDATION_ERROR: "talkpeach/channels/VALIDATION_ERROR"
}

const channelService = new ChannelService();

export const actions = {
    getJoinedChannels,
    addChannel
}

const validationError = (error) => ({
    type: channelActionTypes.VALIDATION_ERROR,
    error
});

const authorizationError = (error) => ({
    type: channelActionTypes.AUTHORIZATION_ERROR,
    error
});

const dispatchError = (message, statusCode, dispatch) => {
    switch (statusCode) {
        case 422:
            dispatch(validationError(message));
            break;
        case 401:
        default:
            dispatch(authorizationError(message));
            break;
    }
}

function getJoinedChannels(participantId) {
    const success = (channels) => ({
        type: channelActionTypes.GET_CHANNELS,
        channels
    });

    return async dispatch => {
        try {
            const response = await channelService.getByParticipant(participantId);
            dispatch(success(response.data));
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

function addChannel(channel) {
    const success = (newChannel) => ({
        type: channelActionTypes.ADD_CHANNEL,
        newChannel
    });

    return async dispatch => {
        try {
            const response = await channelService.add(channel);
            dispatch(success(response.data));
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

const initialState = {
    joined: [],
    errors: {}
}

export default function channels(state = initialState, action) {
    switch (action.type) {
        case channelActionTypes.GET_CHANNELS:
            return Object.assign({}, state, { joined: action.channels });
        case channelActionTypes.ADD_CHANNEL:
            return Object.assign({}, state, { joined: [ ...state.channels, action.newChannel ] });
        case channelActionTypes.VALIDATION_ERROR:
            return Object.assign({}, state, { errors: { ...state.errors, validationError: action.error } });
        case channelActionTypes.AUTHORIZATION_ERROR:
            return Object.assign({}, state, { errors: { ...state.errors, authorizationError: action.error } });
        default:
            return state;
    }
}