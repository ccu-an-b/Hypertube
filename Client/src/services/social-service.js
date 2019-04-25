import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class SocialService {
    
    likeEvent(id, moveid, side) {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/like`, {
                id: id,
                movie: moveid,
                side: side
            }).then(
                res => resolve(res.data.result),
                err => reject(err)
            )
        })
    }
}

export default new SocialService()