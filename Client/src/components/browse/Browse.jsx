import React from 'react';
import { Link } from 'react-router-dom';
import BrowseBar from './BrowseBar'
import MovieGallery from './MovieGallery';
import {PaginationComp} from './Pagination';
import movieService from 'services/movies-services';
import userService from 'services/user-service';
import { connect } from 'react-redux';
import * as actions from 'store/actions';
const Text = require('../../helpers/languages');

class Browse extends React.Component {

    constructor() {
        super()
        this.state = {
            page: 1,
            sort: "",
            order: '',
            movies: [],
            genre:"",
            count:1,
            yearInt:[1910, 2019],
            ratingInt:[0, 10],
            language: 'en'
        }
        this.browseRef = React.createRef()
    }

    fetchMovies = async () => {
        await movieService.fetchMovies(
            this.state.title,
            this.state.page,
            this.state.sort,
            this.state.order,
            this.state.genre,
            this.state.yearInt,
            this.state.ratingInt,
        ).then(res =>{
            if (res.movies){
                this.setState({ movies: res.movies, count: res.count})
            }
        })
    }

    componentDidMount() {
        this.fetchMovies()
    }

    scrollToBrowse = () =>{
        this.browseRef.current.scrollIntoView({behavior: 'smooth', block: "start"})
    }

    paginationHandle = async (event) => {
        await this.setState({ page: event })
        this.fetchMovies()
    }

    sortHandle = async (event) => {
        await this.setState({ sort: event ? event.value : ""})
        this.paginationHandle(1)
    }

    orderHandle = async (event) => {
        await this.setState({ order: event ? event.value : "" })
        this.paginationHandle(1)
    }

    filterGenre = async (event) => {
        await this.setState({ genre: event ? event.value : "" })
        this.paginationHandle(1)
    }
    
    searchHandler = async (event) => {
        await this.setState({ title: event })
        this.paginationHandle(1)
    }

    yearHandle = async (value) => {
        await this.setState({ yearInt: value })
        this.paginationHandle(1)
    }

    ratingHandle = async (value) => {
        await this.setState({ ratingInt: value })
        this.paginationHandle(1)
    }

    listHandle = (isMyList, movieId) => {
        if (isMyList){
            return userService.removeMyList(movieId)
            .then((res) =>  this.props.dispatch(actions.updateUserSuccess(res)))
        }
        return userService.addMyList(movieId)
        .then((res) =>  this.props.dispatch(actions.updateUserSuccess(res)))
    }

    render() {
        const { movies, page , count} = this.state;
        const { user } = this.props;

        return( 
            <div className="browse-container">
                <div className="browse-header" style={{'backgroundImage': `url("${process.env.PUBLIC_URL}/background.png")`}}>
                    <div className="welcome">
                        {user && <h1>{Text.welcomeTitle[user.language]}</h1> }
                        {user &&   <h2>{Text.welcomeSubtitle[user.language]}</h2>}
                        {user &&
                         <div className="hypertube-buttons">
                            <div className="video-button yellow" id="to_browse" onClick={() => this.scrollToBrowse()}>{Text.browse[user.language]}</div>
                            <Link to={`/mylist`}>
                                <div className="video-button transparent">{Text.list[user.language]}</div>
                            </Link>
                        </div>
                        }
                    </div>
                </div>
                {user && 
                    <BrowseBar 
                        lang ={user.language}
                        browseref={this.browseRef}
                        searchHandler={this.searchHandler}
                        filterTypeHandle={this.filterTypeHandle}
                        filterGenre={this.filterGenre}
                        sortHandle={this.sortHandle}
                        orderHandle={this.orderHandle}
                        yearHandle={this.yearHandle}
                        ratingHandle={this.ratingHandle}
                    />
                }
                <PaginationComp 
                    paginationHandle={this.paginationHandle}
                    page={page}
                    pageCount={count}
                />
                {movies.length && 
                    <MovieGallery  
                        movies={movies}  
                        lang ={user.language}
                        mylist={user.mylist}
                        seen={user.seen}
                        listHandle={this.listHandle}/> 
                }
                {!movies.length && count !==0 &&
                    <div className="loading_gif"><img src={`${process.env.PUBLIC_URL}/loading.gif`} alt="loading" /></div>
                }
                {count === 0 && 
                    <div className="no-result">
                        <h2>{Text.noMovie[user.language]}</h2>
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.data
    }
  }
  export default connect(mapStateToProps)(Browse);