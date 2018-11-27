import UserService from './userService';
import { TOKEN_KEY } from '../constants';

export const authActionTypes = {
    LOGIN_REQUEST: 'talkpeach/authentication/LOGIN_REQUEST',
    LOGIN_SUCCESS: 'talkpeach/authentication/LOGIN_SUCCESS',
    LOGIN_ERROR: 'talkpeach/authentication/LOGIN_ERROR',
    LOGOUT: 'talkpeach/authentication/LOGOUT',
    REGISTRATION_REQUEST: 'talkpeach/authentication/REGISTRATION_REQUEST',
    REGISTRATION_SUCCESS: 'talkpeach/authentication/REGISTRATION_SUCCESS',
    REGISTRATION_ERROR: 'talkpeach/authentication/REGISTRATION_ERROR'
}

const userService = new UserService();

export const actions = {
    login,
    logout,
    register
};

function login(username, password) {
    const success = (token) => { return { type: authActionTypes.LOGIN_SUCCESS, token }; };
    const failure = (error) => { return { type: authActionTypes.LOGIN_ERROR, error }; };
    const requestStarted = () => { return { type: authActionTypes.LOGIN_REQUEST }; };

    return dispatch => {
        dispatch(requestStarted());
        userService.login({ username, password })
            .then(response => {
                dispatch(success(response.data));
            })
            .catch(error => {
                dispatch(failure(error));
            })
    };
}

function logout() {
    return dispatch => {
        userService.logoff()
            .then(() => {
                dispatch({ type: authActionTypes.LOGOUT });
            })
            .catch(() => {
                dispatch({ type: authActionTypes.LOGOUT });
            });
    }
}

function register(user) {
    const success = (user) => { return { type: authActionTypes.REGISTRATION_SUCCESS, user }; };
    const failure = (error) => { return { type: authActionTypes.REGISTRATION_ERROR, error }; };
    const requestStarted = () => { return { type: authActionTypes.REGISTRATION_REQUEST }; };

    return dispatch => {
        dispatch(requestStarted());
        userService.register(user)
            .then(response => {
                dispatch(success(response.data));
            })
            .catch(error => {
                dispatch(failure(error));
            });
    }
}

const initialState = {
    token: localStorage.getItem(TOKEN_KEY)
}

export default function authentication(state = initialState, action) {
    switch (action.type) {
        case authActionTypes.LOGIN_SUCCESS:
            localStorage.setItem(TOKEN_KEY, action.token.token);
            return Object.assign(state, action.token);
        case authActionTypes.REGISTRATION_SUCCESS:
            return Object.assign(state, { user: action.user });
        case authActionTypes.LOGOUT:
            var newState = Object.assign({}, state);
            delete newState.token;
            localStorage.removeItem(TOKEN_KEY);
            return newState;
        default:
            return state;
    }
}