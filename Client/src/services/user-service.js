import axiosService from './axios-service';
import axios from 'axios';

const axiosInstance = axiosService.getInstance();

class UserService {

    register = (userData) => { //Register New User
        return axios.post(`/api/user`, { ...userData }).then(
          res => res,
          err => Promise.reject(err.response.data.errors)
        );
    }

    uploadImg = img => { //Image Upload
        const formData = new FormData();
        formData.append('img', img);
    
        return axios.post('/api/upload/', formData).then(
            res => res.data.imageUrl,
            err => Promise.reject(err)
        )
    }

    getUserProfile(login){ // Get user profile
        return axiosInstance.get(`/profile`,{params: {login}}).then(
            res => res.data.result,
            err => Promise.reject()
        )
    }

    fetchAllUsers (){ //Fetch all users
        return axiosInstance.get(`/users`).then(
            res => res.data
        )
    }
    modifyPassword(userData){ // Modify user password
        return axiosInstance.put(`/account/password`, userData) 
        .then(res =>{
            if (!res.data.status)
              throw(res.data.result)
            return false;
          })
          .catch((response) => {
            return response;
          })
    }

    fetchMyList(){ // Get user List of movies
        return axiosInstance.get(`/mylist`).then(
            res => res.data.result
        )
    }

    addMyList(movieId){ // Add movie to user List
        return axiosInstance.post(`/mylist`,{movie: movieId}).then(
            res => res.data.result
        )
    }

    removeMyList(movieId){ // Delete movie from user List
        return axiosInstance.delete(`/mylist?movie=${movieId}`).then(
            res => res.data.result
        ) 
    }

    getUserFromKey(key){ // Get user from key
        return axios.get(`/api/password`,{params: {key}})
        .then((res) => res)
    }

    lostPassword(userData){ // Send user retrive password mail
        return axios.post(`/api/password`, userData)
        .then((res) => res )
    }

    retrievePassword(userData){ // Update user password
        return axios.put('/api/password', userData)
        .then((res) => res)
    }
}

export default new UserService();