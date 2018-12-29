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
    UPDATE_PROFILE_REQUEST: 'talkpeach/authentication/UPDATE_PROFILE_REQUEST',
    UPDATE_PROFILE_SUCCESS: 'talkpeach/authentication/UPDATE_PROFILE_SUCCESS',
    UPDATE_PROFILE_ERROR: 'talkpeach/authentication/UPDATE_PROFILE_ERROR'
}

const userService = new UserService();

export const actions = {
    login,
    logout,
    register,
    getCurrentUser,
    updateProfile
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
        case authActionTypes.UPDATE_PROFILE_ERROR:
            return Object.assign({}, state, action.error);
        case authActionTypes.UPDATE_PROFILE_SUCCESS:
            var newState = Object.assign({}, state, { user: { ...action.user, ...state.user } });
            delete newState.error;
            return newState;
        default:
            return state;
    }
}