import UserService from './userService';
import {
    TOKEN_KEY
} from '../constants';

export const authActionTypes = {
    LOGIN_REQUEST: 'talkpeach/authentication/LOGIN_REQUEST',
    LOGIN_SUCCESS: 'talkpeach/authentication/LOGIN_SUCCESS',
    LOGIN_ERROR: 'talkpeach/authentication/LOGIN_ERROR',
    LOGOUT: 'talkpeach/authentication/LOGOUT',
    REGISTRATION_REQUEST: 'talkpeach/authentication/REGISTRATION_REQUEST',
    REGISTRATION_SUCCESS: 'talkpeach/authentication/REGISTRATION_SUCCESS',
    REGISTRATION_ERROR: 'talkpeach/authentication/REGISTRATION_ERROR',
    GET_CURRENT_USER: 'talkpeach/authentication/GET_CURRENT_USER',
    GET_DIRECT_MESSAGES: 'talkpeach/authentication/GET_DIRECT_MESSAGES',
    UPDATE_PROFILE_REQUEST: 'talkpeach/authentication/UPDATE_PROFILE_REQUEST',
    UPDATE_PROFILE_SUCCESS: 'talkpeach/authentication/UPDATE_PROFILE_SUCCESS',
    UPDATE_PROFILE_ERROR: 'talkpeach/authentication/UPDATE_PROFILE_ERROR',
    NEW_DIRECT_MESSAGES: 'talkpeach/authentication/NEW_DIRECT_MESSAGES',
    SEARCH_USERS: 'talkpeach/authentication/SEARCH_USERS'
}

const userService = new UserService();

export const actions = {
    login,
    logout,
    register,
    getCurrentUser,
    getDirectMessages,
    updateProfile,
    newDirectMessage,
    searchUsers
};

function login(username, password) {
    const success = (token) => {
        return {
            type: authActionTypes.LOGIN_SUCCESS,
            token
        };
    };
    const failure = (error) => {
        return {
            type: authActionTypes.LOGIN_ERROR,
            error
        };
    };
    const requestStarted = () => {
        return {
            type: authActionTypes.LOGIN_REQUEST
        };
    };

    return async dispatch => {
        dispatch(requestStarted());
        try {
            const response = await userService.login({
                username,
                password
            });
            dispatch(success(response.data.token));
        } catch (error) {
            dispatch(failure(error.response.data));
        }
    };
}

function logout() {
    return async dispatch => {
        try {
            await userService.logoff();
            dispatch({
                type: authActionTypes.LOGOUT
            });
        } catch (error) {
            dispatch({
                type: authActionTypes.LOGOUT
            });
        }
    }
}

function register(user) {
    const success = (user) => {
        return {
            type: authActionTypes.REGISTRATION_SUCCESS,
            user
        };
    };
    const failure = (error) => {
        return {
            type: authActionTypes.REGISTRATION_ERROR,
            error
        };
    };
    const requestStarted = () => {
        return {
            type: authActionTypes.REGISTRATION_REQUEST
        };
    };

    return async dispatch => {
        dispatch(requestStarted());
        try {
            const response = await userService.register(user);
            dispatch(success(response.data));
        } catch (error) {
            dispatch(failure(error.response.data));
        }
    }
}

function getCurrentUser() {
    return async dispatch => {
        try {
            const response = await userService.getCurrentUser();
            dispatch({
                type: authActionTypes.GET_CURRENT_USER,
                user: response.data
            });
        } catch (error) {
            dispatch({
                type: authActionTypes.LOGOUT
            });
        }
    }
}

function getDirectMessages(directMessages) {
    const success = (users) => {
        return {
            type: authActionTypes.GET_DIRECT_MESSAGES,
            users
        };
    };
    const failure = (error) => {
        return {
            type: authActionTypes.GET_DIRECT_MESSAGES,
            error
        };
    };
    const requestStarted = () => {
        return {
            type: authActionTypes.GET_DIRECT_MESSAGES
        };
    };
    return async dispatch => {
        try {
            dispatch(requestStarted());
            var i, users = [];
            for (i = 0; i < directMessages.length; i++) {
                const res = await userService.getUser(directMessages[i]);
                if (res.status === 200) {
                    await users.push(res.data);
                } else {
                    dispatch(failure(res.data || 'Unknown error!'));
                }
            }
            if (i === directMessages.length) {
                dispatch(success(users));
            }
        } catch (error) {
            dispatch(failure(error))
        }
    }
}

function updateProfile(userId, user) {
    const success = (user) => {
        return {
            type: authActionTypes.UPDATE_PROFILE_SUCCESS,
            user
        };
    };
    const failure = (error) => {
        return {
            type: authActionTypes.UPDATE_PROFILE_ERROR,
            error
        };
    };
    const requestStarted = () => {
        return {
            type: authActionTypes.UPDATE_PROFILE_REQUEST
        };
    };

    return async dispatch => {
        try {
            dispatch(requestStarted());
            const response = await userService.update(userId, user);
            if (response.status === 204)
                dispatch(success(user));
            else
                dispatch(failure(response.data || 'Unknown error!'));
        } catch (error) {
            dispatch(failure(error));
        }
    }
}

function searchUsers(name) {
    const foundUsers = (users) => ({
        type: authActionTypes.SEARCH_USERS,
        users 
    });
    const failure = (error) => {
        return {
            type: authActionTypes.SEARCH_USERS,
            error
        };
    };

    return async dispatch => {
        try {
            const response = await userService.getByName(name);
            dispatch(foundUsers(response.data));
        } catch (error) {
            dispatch(failure(error.response.data || 'Unknown error!'));
        }
    }
}

function newDirectMessage(userId) {
    const failure = (error) => {
        return {
            type: authActionTypes.SEARCH_USERS,
            error
        };
    };
    return async dispatch => {
        try {
            await userService.newDirectMessage(userId);
            response = await userService.getCurrentUser();
            dispatch(getDirectMessages(response.data.directMessages));
        } catch (error) {
            dispatch(failure(error.response.data || 'Unknown error!'));
        }
    }
}

const initialState = {
    token: localStorage.getItem(TOKEN_KEY)
}

export default function authentication(state = initialState, action) {
    switch (action.type) {
        case authActionTypes.LOGIN_SUCCESS:
            localStorage.setItem(TOKEN_KEY, action.token);
            var newState = Object.assign({}, state, { token: action.token});
            delete newState.error;
            return newState;
        case authActionTypes.REGISTRATION_SUCCESS:
            var newState = Object.assign({}, state, {
                user: action.user
            });
            delete newState.error;
            return newState;
        case authActionTypes.LOGOUT:
        case authActionTypes.LOGIN_REQUEST:
            var newState = Object.assign({}, state);
            delete newState.token;
            localStorage.removeItem(TOKEN_KEY);
            return newState;
        case authActionTypes.LOGIN_ERROR:
        case authActionTypes.REGISTRATION_ERROR:
            return Object.assign({}, state, action.error);
        case authActionTypes.GET_CURRENT_USER:
            return Object.assign({}, state, { user: action.user });
        case authActionTypes.GET_DIRECT_MESSAGES:
            return Object.assign({}, state, { users: action.users });
        case authActionTypes.UPDATE_PROFILE_ERROR:
            return Object.assign({}, state, action.error);
        case authActionTypes.SEARCH_USERS:
            return Object.assign({}, state, { searchResult: action.users });
        case authActionTypes.UPDATE_PROFILE_SUCCESS:
            var newState = Object.assign({}, state, { user: { ...action.user, ...state.user } });
            delete newState.error;
            return newState;
        default:
            return state;
    }
}