import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import authentication from './authentication';

export default combineReducers({ 
    routing: routerReducer,
    authentication
});