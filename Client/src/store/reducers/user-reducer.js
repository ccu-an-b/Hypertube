import {    FETCH_USER_SUCCESS,
            FETCH_USER_INIT,
            UPDATE_USER_SUCCESS,
        } from 'store/actions/types';

const INITIAL_STATE = {
    user: {
        data:undefined,
    }
}

export const connectedUserReducer = (state = INITIAL_STATE.user, action) => {
    switch(action.type) {
        case FETCH_USER_INIT:
            return {...state, data: undefined};
        case FETCH_USER_SUCCESS:
            return {...state, data: action.user}
        case UPDATE_USER_SUCCESS:
            return {...state, data: action.user}
        default:
            return state;
        }
}