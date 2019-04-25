import React from 'react';
import { connect } from 'react-redux';
import MovieGallery from '../browse/MovieGallery';
import userService from 'services/user-service';
import * as actions from 'store/actions';

const Text = require('../../helpers/languages');

export class MyList extends React.Component {
  constructor(){
      super();
      this.state = {
        movies:[],
      }
  }

  componentDidMount() {
    this.fetchMovies()
  }

  fetchMovies() {
    userService.fetchMyList().then(
        movies => this.setState({movies})
    )
  }

  listHandle = (isMyList, movieId) => {
    userService.removeMyList(movieId)
    .then((res) =>  this.props.dispatch(actions.updateUserSuccess(res)))
    .then(() => this.fetchMovies() )
    }

  render() {
    const { movies } = this.state;
    const { user } = this.props;

    if (user){
        return (
            <div className="mylist-page">
               {movies && movies.length ?
                  <MovieGallery  
                        movies={movies}  
                        lang ={user.language}
                        mylist={user.mylist}
                        seen={user.seen}
                        listHandle={this.listHandle}
                        title={Text.list[user.language]} 
                    />
                  :  <div className="no-list">
                        <h1 >{Text.list[user.language]}</h1>
                        <h2>{Text.noList[user.language]}</h2>
                      </div> 
              }
            </div>
          )
    }
    else{
        return (
            <div className="loading_gif"><img src={`${process.env.PUBLIC_URL}/loading.gif`} alt="loading" /></div> 
        )
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user.data
})

export default connect(mapStateToProps)(MyList)
