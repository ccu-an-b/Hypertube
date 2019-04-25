import thunk from 'redux-thunk';
import { reducer as formReducer} from 'redux-form';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';

import { connectedUserReducer} from './user-reducer';
import { authReducer} from './auth-reducer';

export const init = () => {
    const reducer = combineReducers({
        user: connectedUserReducer,
        form: formReducer,
        auth: authReducer
    });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

    return store;
}