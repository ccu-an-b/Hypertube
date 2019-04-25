import {    LOGIN_SUCCESS,
            LOGIN_FAILURE,
            LOGOUT } from 'store/actions/types';

const INITIAL_STATE = {
    isAuth: false,
    login: '',
    errors: []
}

export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {isAuth: true, login: action.login, errors: []});
        case LOGIN_FAILURE:
            return Object.assign({}, state, {errors: [action.errors]});
        case LOGOUT:
            return Object.assign({}, state, {isAuth: false, login: ''});
        default:
            return state;
    }
}