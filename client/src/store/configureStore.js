import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../rootReducer';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

export const history = createHistory();
const routingMiddleware = routerMiddleware(history);

function configureStore() {
    const store = createStore(rootReducer, applyMiddleware(routingMiddleware, thunkMiddleware));
    return store;
}

export const store = configureStore();