import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import authentication from './authentication';
import channels from './channels';
import chat from './chat';

export default combineReducers({ 
    routing: routerReducer,
    authentication,
    channels,
    chat
});