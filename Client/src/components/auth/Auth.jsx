import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import authService from 'services/auth-service';
import * as actions from 'store/actions';

export class Auth extends React.Component {

    constructor() {
        super();
        this.state = {
            error:false
        }
    }

    componentWillMount(){
        const authToken = this.props.match.params.token;
        const isValid = authService.verifyToken(authToken);
        
        if (!authToken || !isValid)
            this.setState({error: true})

       else if (authToken){
            authService.saveToken(authToken);
            this.props.dispatch(actions.loginSuccess(authToken));
            this.props.dispatch(actions.fetchUser())
        }
    }
    
  
    render(){
        const { isAuth } = this.props.auth;
        const { error } = this.state;

        if (isAuth || error){
            return <Redirect to={{pathname: '/'}} />
        }
        else {
            return (
                <div className= "index loading token">
                    <div className="index-container">
                        <h1 className="hypertube">H</h1>
                    </div>
                </div>
            )
        }
    }
}

function mapStateToProps(state){
    return {
        auth: state.auth,
    }
}
export default connect(mapStateToProps)(Auth);