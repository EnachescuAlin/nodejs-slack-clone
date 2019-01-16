import ChannelService from './channelService';
import UserService from '../authentication/userService';

export const channelActionTypes = {
    GET_CHANNELS: "talkpeach/channels/GET_CHANNELS",
    SELECT_CHANNEL: "talkpeach/channels/SELECT_CHANNEL",
    ADD_CHANNEL: "talkpeach/channels/ADD_CHANNEL",
    ADD_PARTICIPANT: "talkpeach/channels/ADD_PARTICIPANT",
    UPDATE_CHANNEL: "talkpeach/channels/UPDATE_CHANNEL",
    AUTHORIZATION_ERROR: "talkpeach/channels/AUTHORIZATION_ERROR",
    VALIDATION_ERROR: "talkpeach/channels/VALIDATION_ERROR",
    NOT_FOUND_ERROR: "talkpeach/channels/NOT_FOUND_ERROR",
    SEARCH_CHANNELS: "talkpeach/channels/SEARCH_CHANNELS",
    SEARCH_USERS_FOR_INVITE: "talkpeach/channels/SEARCH_USERS_FOR_INVITE",
    GET_MEMBERS: "talkpeach/channels/GET_MEMBERS",
    CLEAR_USER_SEARCH: "talkpeach/channels/CLEAR_USER_SEARCH",
    REMOVE_PARTICIPANT: "talkpeach/channels/REMOVE_PARTICIPANT" 
}

const channelService = new ChannelService();
const userService = new UserService();

export const actions = {
    getJoinedChannels,
    addChannel,
    searchChannels,
    addParticipant,
    joinChannel,
    updateChannel,
    selectChannel,
    searchUsersForInvite,
    getMembers,
    clearUserSearch,
    removeParticipant
}

const validationError = (error) => ({
    type: channelActionTypes.VALIDATION_ERROR,
    error
});

const authorizationError = (error) => ({
    type: channelActionTypes.AUTHORIZATION_ERROR,
    error
});

const notFoundError = (error) => ({
    type: channelActionTypes.NOT_FOUND_ERROR,
    error
});

const dispatchError = (message, statusCode, dispatch) => {
    switch (statusCode) {
        case 422:
            dispatch(validationError(message));
            break;
        case 404:
            dispatch(notFoundError(message));
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

function searchChannels(name) {
    const foundChannels = (channels) => ({
        type: channelActionTypes.SEARCH_CHANNELS,
        channels 
    });

    return async dispatch => {
        try {
            const response = await channelService.getByName(name);
            dispatch(foundChannels(response.data));
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

function clearUserSearch() {
    return {
        type: channelActionTypes.CLEAR_USER_SEARCH
    }
}

function searchUsersForInvite(username) {
    const foundUsers = (users) => ({
        type: channelActionTypes.SEARCH_USERS_FOR_INVITE,
        users
    });
    return async dispatch => {
        try {
            const response = await userService.searchUsers(username);
            dispatch(foundUsers(response.data));
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

function addParticipant(channelId, user) {
    const success = () => ({
        type: channelActionTypes.ADD_PARTICIPANT,
        user
    });

    return async dispatch => {
        try {
            await channelService.addParticipant(channelId, user.id);
            dispatch(success());
            dispatch(clearUserSearch());
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

function removeParticipant(channelId, user) {
    const success = () => ({
        type: channelActionTypes.REMOVE_PARTICIPANT,
        user
    });

    return async dispatch => {
        try {
            await channelService.removeParticipant(channelId, user.id);
            dispatch(success());
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

function joinChannel(channelId, participantId) {
    return async dispatch => {
        try {
            await channelService.join(channelId);
            dispatch(getJoinedChannels(participantId));
        } catch (error) {
            console.log(error);
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

function updateChannel(id, channel) {
    const success = (updatedChannel) => ({
        type: channelActionTypes.UPDATE_CHANNEL,
        updatedChannel
    });

    return async dispatch => {
        try {
            const response = await channelService.update(id, channel);
            dispatch(success(response.data));
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

function selectChannel(id) {
    const success = (channel) => ({
        type: channelActionTypes.SELECT_CHANNEL,
        channel
    });

    return async dispatch => {
        try {
            const response = await channelService.get(id);
            dispatch(success(response.data));
        } catch (error) {
            dispatchError(error.response.data, error.response.statusCode, dispatch);
        }
    }
}

function getMembers(id) {
    const success = (members) => ({
        type: channelActionTypes.GET_MEMBERS,
        members
    });

    return async dispatch => {
        try {
            const response = await channelService.getMembers(id);
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
        case channelActionTypes.SEARCH_CHANNELS:
            return Object.assign({}, state, { searchResult: action.channels });
        case channelActionTypes.SEARCH_USERS_FOR_INVITE:
            return {
                ...state,
                usersSearched: action.users.filter(user => !state.selected || state.selected.members.indexOf(user.id) === -1)
            }
        case channelActionTypes.CLEAR_USER_SEARCH:
            return {
                ...state,
                usersSearched: []
            }
        case channelActionTypes.ADD_CHANNEL:
            return Object.assign({}, state, { joined: [ ...state.channels, action.newChannel ] });
        case channelActionTypes.UPDATE_CHANNEL:
            return {
                ...state,
                joined: state.joined.map(channel => {
                    if (channel.id === action.updatedChannel.id)
                        return action.updatedChannel;
                    return channel;
                }),
                selected: action.updatedChannel
            }
        case channelActionTypes.SELECT_CHANNEL:
            return Object.assign({}, state, { selected: action.channel });
        case channelActionTypes.GET_MEMBERS:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    participants: action.members
                }
            }
        case channelActionTypes.ADD_PARTICIPANT:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    participants: [
                        ...state.selected.participants,
                        action.user
                    ]
                }
            };
        case channelActionTypes.REMOVE_PARTICIPANT:
            console.log({
                ...state,
                selected: {
                    ...state.selected,
                    participants: state.selected.participants.filter(user => user.id !== action.user.id)
                }
            });
            return {
                ...state,
                selected: {
                    ...state.selected,
                    participants: state.selected.participants.filter(user => user.id !== action.user.id)
                }
            }
        case channelActionTypes.VALIDATION_ERROR:
            return Object.assign({}, state, { errors: { ...state.errors, validationError: action.error } });
        case channelActionTypes.AUTHORIZATION_ERROR:
            return Object.assign({}, state, { errors: { ...state.errors, authorizationError: action.error } });
        case channelActionTypes.NOT_FOUND_ERROR:
            return Object.assign({}, state, { errors: { ...state.errors, notFoundError: action.error } });
        default:
            return state;
    }
}