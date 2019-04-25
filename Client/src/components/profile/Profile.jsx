import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import userService from 'services/user-service';
import { imgPath } from 'helpers';

const Text = require('../../helpers/languages');

class Profile extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
        redirect: false,
        }
    }

    componentDidMount = async () => {
        this._isMounted = true;
        const username = this.props.match.params.username;

        if(this._isMounted){
            this.setState({username})
            const user = await userService.getUserProfile(username)
            this.setState({data: user})
        }
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    renderMovies(movies) {
        return movies.map((movie, index) => {
            return(
            <Link to={{ pathname: "/play", id: movie._id,src: movie.src}} key={index} className="movie-profile">
                <img alt="poster" src={imgPath(movie.img)}/>
            </Link>
            )
        });
    }

    render() {
        const {data} = this.state
        const {user} = this.props;

        if (data && user ){
            return(
                <div className="profile-page">
                    <div className="profile-container">
                        <div className="header">
                            <img src={imgPath(data.img)} alt="profile_img"/>
                            <div className="info">
                                <h1>{data.firstname} {data.lastname}</h1>
                                <h2>{data.login}</h2>
                            </div>
                            <div className="lang">
                                <img src={`${process.env.PUBLIC_URL}/${user.language}.svg`} alt="language"/>
                            </div>
                        </div>

                        {data.mylist.length &&
                            <div className="profile-list">
                            <h2>{Text.list[user.language]}</h2>
                            <div className="profile-list-container">
                                {this.renderMovies(data.mylist)}
                            </div>
                            </div>
                        }
                        {data.seen.length &&
                            <div className="profile-list">
                            <h2>{Text.seen[user.language]}</h2>
                            <div className="profile-list-container">
                                {this.renderMovies(data.seen)}
                            </div>
                            </div>
                        }
                    </div>
                </div>
            )
        }
        else{
            return (
                <div className="profile-page">
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
    user: state.user.data,
  };
}

export default connect(mapStateToProps)(Profile);
