import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../rootReducer';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

export const history = createHistory();
const routingMiddleware = routerMiddleware(history);

function configureStore() {
    const store = createStore(rootReducer, applyMiddleware(routingMiddleware));
    return store;
}

export const store = configureStore();