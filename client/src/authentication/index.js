import UserService from './userService';

export const authActionTypes = {
    LOGIN_SUCCESS: 'talkpeach/authentication/LOGIN_SUCCESS',
    LOGIN_ERROR: 'talkpeach/authentication/LOGIN_ERROR',
    LOGOUT: 'talkpeach/authentication/LOGOUT',
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

    return dispatch => {
        userService.login({ username, password })
            .then(token => {
                dispatch(success(token));
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

    return dispatch => {
        userService.register(user)
            .then(newUser => {
                dispatch(success(newUser));
            })
            .catch(error => {
                dispatch(failure(error));
            });
    }
}

export default function authentication(state = {}, action) {
    switch (action.type) {
        case authActionTypes.LOGIN_SUCCESS:
            return Object.assign(state, action.token);
        case authActionTypes.REGISTRATION_SUCCESS:
            return Object.assign(state, action.user);
        case authActionTypes.LOGOUT:
            var newState = Object.assign({}, state);
            delete newState.token;
            return newState;
        default:
            return state;
    }
}