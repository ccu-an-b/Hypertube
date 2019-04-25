import React from 'react';
import LoginForm from '../landing/LoginForm';
import ChangePasswordForm from './ChangePasswordForm';
import Modal from '../shared/modal/Modal';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from 'store/actions';
import userService from 'services/user-service';

export class Password extends React.Component {
    _isMounted = false;
    constructor() {
        super();
        this.state = {
            errors:[],
            isChange: false,
            success:[],
            keyExist: true
        }
    }
    componentDidMount(){
        const { isAuth } = this.props.auth;
        const activationKey = this.props.match.params.key;
        this._isMounted = true;
        
        if (activationKey && this._isMounted && !isAuth ){
            return userService.getUserFromKey(activationKey)
            .then((res) => {
                if (!res.data.status && this._isMounted)
                    this.setState({keyExist: false})
                else if (this._isMounted)
                    this.setState({login: res.data.result.login})
            })
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
    
    changePassword = (userData) =>{
        userData.key = this.props.match.params.key;
        userData.login = this.state.login;

        return userService.retrievePassword(userData)
        .then((res) => {
            if (!res.data.status)
                throw(res.data.status)
            this.setState({isChange: true, success:res.data.result })
        })
        .catch((err) => this.setState({errors: [err]}))
    }

    logInUser = async (userData) =>{
        await this.props.dispatch(actions.login(userData));
        if (this.props.auth.isAuth)
            this.props.dispatch(actions.fetchUser())
        else
            this.setState({errors : this.props.auth.errors})
    }

    render() {
        const { isAuth, errors} = this.props.auth;
        const  {success, isChange, keyExist} = this.state

        if (isAuth || !keyExist || !this.props.match.params.key){
            return <Redirect to={{pathname: '/'}} />
        }
    
        else
        {
            return (
                <div className="index" style={{'backgroundImage': `url("${process.env.PUBLIC_URL}/background.png")`}}>
                    <div className="index-container">
                        <h1 className="hypertube">Hypertube</h1>
                    </div>
                    {isChange ?
                        <Modal show={true} handleClose={this.hideModal} children={<LoginForm submitCb={this.logInUser} errors={errors} success={success} changePassword={true}/>} close={true}/> :
                        <Modal show={true} handleClose={this.hideModal} children={<ChangePasswordForm submitCb={this.changePassword} errors={errors}/>} close={true}/>
                    }
                  
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
export default connect(mapStateToProps)(Password);