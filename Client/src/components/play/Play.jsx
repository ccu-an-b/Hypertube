import React from 'react'
import { Redirect } from 'react-router-dom';
import { MediaDescription } from './MediaDescription';
import MediaPlayer from './MediaPlayer';
import Comment from './Comment';
import movieService from 'services/movies-services';
import userService from 'services/user-service';
import { connect } from 'react-redux';
import * as actions from 'store/actions';
import { inMyList } from 'helpers';
import socialService from 'services/social-service';

class Play extends React.Component {
    constructor() {
        super()
        this.state = {
            params: [],
            movie: [],
            imdb: [],
            isLoading: true,
            playerDisplayed: { status: false }
        }
    }

    async componentDidMount() {
        if (!this.props.history.location.id)
            this.setState({ redirect: true })
        else {
            await this.setState({ params: this.props.history.location })
            const movie = await movieService.fetchOneMovie(this.props.history.location.id)
            this.seenHandle(movie._id);
            this.setState({ movie, isLoading: false })
        }
    }

    getSubtitles = async () => {
        const movie = await movieService.fetchOneMovie(this.props.history.location.id)
        this.setState({ movie})
    }
    listHandle = (movieId) => {
        if (inMyList(movieId, this.props.user.mylist)) {
            return userService.removeMyList(movieId)
                .then((res) => this.props.dispatch(actions.updateUserSuccess(res)))
        }
        return userService.addMyList(movieId)
            .then((res) => this.props.dispatch(actions.updateUserSuccess(res)))
    }

    seenHandle = (movieId) => {
        if (!inMyList(movieId, this.props.user.seen)) {
            return movieService.seenMovie(movieId)
                .then((res) => this.props.dispatch(actions.updateUserSuccess(res)))
        }
    }

    async like(side) {
        await socialService.likeEvent(this.props.user._id, this.state.movie._id, side)
        const movie = await movieService.fetchOneMovie(this.props.history.location.id)
        this.setState({ movie, isLoading: false })
    }

    render() {
        const { movie, redirect, isLoading } = this.state;
        const { user } = this.props
        if (redirect) {
            return <Redirect to={{ pathname: '/' }} />
        }
        else if (user && movie && !isLoading) {
            return (
                <div className="video-page">
                    <MediaDescription
                        id={movie._id}
                        img={movie.img}
                        genre={movie.genre}
                        rating={movie.rating}
                        runtime={movie.runtime}
                        synopsis={movie.synopsis[user.language]}
                        title={movie.title[user.language]}
                        torrents={movie.torrents}
                        year={movie.year}
                        cast={movie.cast}
                        director={movie.director}
                        lang={user.language}
                        mylist={inMyList(movie._id, user.mylist)}
                        listHandle={this.listHandle}
                        src={movie.src}
                    />
                    <div>
                        <div>
                            <MediaPlayer movie={movie} getSubtitles={this.getSubtitles} />
                        </div>
                        <div className="social">
                            <div className={inMyList(user._id, movie.like) ? "like isLike" : "like"}>
                                <i className="fas fa-thumbs-up" onClick={() => this.like(1)}></i>
                                {movie.like.length}
                            </div>
                            <div className={inMyList(user._id, movie.dislike) ? "unlike isUnlike" : "unlike"}>
                                <i className="fas fa-thumbs-down" onClick={() => this.like(-1)}></i>
                                {movie.dislike.length}
                            </div>
                        </div>
                        <Comment
                            comments={movie.comments}
                            user={user}
                            movieId={movie._id} />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="video-page">
                    <div className="loading_gif">
                        <img src={`${process.env.PUBLIC_URL}/loading.gif`} alt="loading" />
                    </div>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.data
    }
}
export default connect(mapStateToProps)(Play);