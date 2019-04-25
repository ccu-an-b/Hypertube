import React from 'react'
import userService from 'services/user-service';
import { imgPath } from 'helpers';
import { Link } from 'react-router-dom'
export default class Users extends React.Component {
    _isMounted = false;
    constructor(){
        super();
        this.state={
            users: [],
            isLoading: true,
        } 
    }
    componentDidMount = async () => {
        this._isMounted = true;
        const users = await userService.fetchAllUsers();

        if(this._isMounted){
            this.setState({users, isLoading: false})
        }
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    renderUsers = (users) => {
        return users.map((user, index) => {
            return (
                <Link to={`profile/${user.login}`} key={index}>
                    <div className="one-user">
                            <img onError={(e)=>{e.target.onerror = null; e.target.src=imgPath('img-1554928081072.png')}} src={imgPath(user.img)} alt="profile_pic"/>
                        <div className="info">
                            <h1>{user.firstname} {user.lastname}</h1>
                            <h2>{user.login}</h2>
                            <img src={`${process.env.PUBLIC_URL}/${user.language}.svg`} alt="language" />
                        </div>
                    </div>
                </Link>
            )
        })
    }
    render() {
        const {isLoading, users} = this.state;
        
        return (
        <div className="users-page">
                <div className="users-page-container">
                    {isLoading && 
                        <div className="loading_gif">
                            <img src={`${process.env.PUBLIC_URL}/loading.gif`} alt="loading" />
                        </div>
                    }
                    {users.length && 
                        this.renderUsers(users)
                    }

                </div>
        </div>
        )
    }
}
