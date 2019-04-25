import React from 'react';
import MovieCard from './MovieCard';
import {inMyList} from 'helpers';

export default class MovieGallery extends React.Component {

    constructor(){
        super();
        this.state = {
            show: -1,
        }
    }

    showDescription = (movie_id) =>{
        this.setState({show: movie_id})
    }

    renderMovies = (movies, lang, mylist, listHandle,seen) => {
        return movies.map((movie, index) => {
            if (movie.img && movie.img.includes("http")){
                return (
                    <MovieCard
                        key={index}
                        id={movie._id}
                        img = {movie.img}
                        genres = {movie.genre}
                        rating = {movie.rating}
                        src = {movie.src}
                        synopsis = {movie.synopsis[lang]}
                        title = {movie.title[lang]}
                        year = {movie.year}
                        torrents = {movie.torrents}
                        runtime= {movie.runtime}
                        showDescription = {this.showDescription}
                        showDescriptionId = {this.state.show}
                        trailerKey={movie.trailer[lang]}
                        lang={lang}
                        mylist={inMyList(movie._id, mylist)}
                        listHandle={listHandle}
                        isSeen={inMyList(movie._id, seen)}
                    />
                )
            }
            else {
                return false;
            }
        })
    }  

    render() {
        const { movies, lang , mylist, listHandle, title, seen} = this.props;

        if (movies)
        {
            return (
            <div className="movie-gallery" >
                <div className="movie-container">
                    {title && <h1 className="movie-container-title">{title}</h1>}
                    {this.renderMovies(movies, lang, mylist, listHandle, seen)} 
                </div>
            </div>
        )
        }
        else
            return false;
    }
}
