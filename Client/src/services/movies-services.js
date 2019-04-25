import axiosService from './axios-service';
const axiosInstance = axiosService.getInstance();

class MoviesService {

    fetchMovies = (title, page, sort, order, genre, yearInt, ratingInt) => { // Get 50 movies
        return new Promise((resolve, reject) => {
            axiosInstance.get("/movies", {
                params: {
                    page,
                    sort,
                    order,
                    genre,
                    title,
                    yearMin : yearInt[0],
                    yearMax : yearInt[1],
                    ratingMin : ratingInt[0],
                    ratingMax : ratingInt[1],
                }
            }).then(res => {
                resolve(res.data);
            }).catch(console.log)
        })
    }

    fetchOneMovie(id) { // Get one movie from id
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/movie/${id}`)
            .then(res => {
                resolve(res.data);
            }).catch(console.log)
        })
    }

    addComment(commentData){ // Add comment to a movie
        return axiosInstance.post(`/comment`, commentData).then(
            (res) => res.data.result.comments
        )
    }

    deleteComment(commentId, movieId){ // Delete comment of a movie
        return axiosInstance.delete(`/comment?id=${commentId}&movie=${movieId}`).then(
            (res) => res.data.result.comments
        )
    }
    seenMovie(id){
        return axiosInstance.post(`/seen`, {movie: id}).then(
            res => res.data.result
        )
    }
}

export default new MoviesService();