import axios from 'axios';
import axiosService from 'services/axios-service';
import authService from 'services/auth-service';

import {
    FETCH_USER_INIT,
    FETCH_USER_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT,
    UPDATE_USER_SUCCESS,
} from './types'

const axiosInstance = axiosService.getInstance();

// CONNECTED USER ACTIONS
const fetchUserInit = () => {
    return {
        type: FETCH_USER_INIT
    }
}

const fetchUserSuccess = (user) => {
    return {
        type: FETCH_USER_SUCCESS,
        user
    }
}

export const fetchUser = () => {
    return function(dispatch) {
        dispatch(fetchUserInit())
        axiosInstance.get(`/account`)
        .then((user) => {
            dispatch(fetchUserSuccess(user.data))
        })
    }
}

// AUTH ACTIONS
export const loginSuccess = () => {
  const login = authService.getLogin();

  return {
    type: LOGIN_SUCCESS,
    login
  }
}

const loginFailure = (errors) => {
  return {
    type: LOGIN_FAILURE,
    errors
  }
}

export const checkAuthState = () => {
  return dispatch => {
    if (authService.isAuthentificated()) {
      dispatch(loginSuccess());
    }
  }
}

export const login = (userData) => {
  return dispatch => {
    return axios.post('/auth/login', {...userData})
      .then(res =>{
        if (!res.data.status)
          throw(res.data.message)
        authService.saveToken(res.data.token);
        dispatch(loginSuccess(res.data.token));
      })
      .catch((response) => {
        dispatch(loginFailure(response))
      })
  }
}

export const logout = () => {
  axios.get('/auth/logout');
  return dispatch => {
      dispatch(deleteToken());
      dispatch(fetchUserInit());
  }
}

const deleteToken = () => {
  authService.deleteToken();  
  return {
    type: LOGOUT
  }
}

// UPDATE USER ACTIONS
export const updateUserSuccess = (updatedUser) => {
  return {
    type: UPDATE_USER_SUCCESS,
    user: updatedUser
  }
}

export const updateUser = (userData) => dispatch =>{
  return axiosInstance.put(`/account`, userData)
    .then(res =>{
      if (!res.data.status)
        throw(res.data.result)
      dispatch(updateUserSuccess(res.data.result))
    })
    .catch((response) => {
      return response;
    })
}