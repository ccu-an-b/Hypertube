import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import userService from 'services/user-service';

import Modal from '../shared/modal/Modal';
import Register from './Register';
import PasswordForm from './PasswordForm';
import Login from './Login';

import * as actions from 'store/actions';

export class Landing extends React.Component {

    _isMounted = false;
    constructor() {
        super();
        this.state = {
           isLoading:false,
           showModal:false,
           profile_img:false,
           typeModal:"",
           errors:[],
           success:[],
        }
    }

    componentWillMount() {
        this._isMounted = true;
        setTimeout(() => {
            if (this._isMounted)
                this.setState({isLoading:false})
            },5000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showModal = (type) => {
       this.setState({
           typeModal: type, 
           errors:[],
           success:[],
           showModal:true})
    }

    hideModal = event => {
        if(event.target.id.includes('closeModal') ||event.target.nodeName === 'path' || event.target.nodeName ==='svg')
        {
            this.setState({
                typeModal: "",
                errors:[],
                success:[],
                profile_img:false,
                showModal: false,})
        }
    }

    logInUser = async (userData) => {
        await this.props.dispatch(actions.login(userData));
        if (this.props.auth.isAuth)
            this.props.dispatch(actions.fetchUser())
        else
            this.setState({errors : this.props.auth.errors})
    }

    registerUser = async (userData) => {
        let {profile_img} = this.state

        if (!profile_img){ 
            profile_img = await userService.uploadImg(userData.img) // POST api/upload
            this.setState({profile_img})
        }
        userData.img = profile_img;

        return userService.register(userData) // POST api/user
            .then((res) => {
                if (!res.data.status)
                        throw(res.data)
                this.setState({
                    errors:[],
                    typeModal: 'sign-in',
                    success: "Welcome to Hypertube !"})
            })
            .catch((err) =>  this.setState({errors: [err]}))
    }

    passwordUser = userData => {
        userService.lostPassword(userData)
        .then((res) => {
            console.log(res)
            if (!res.data.status)
                throw (res.data.result)
            this.setState({errors: [], success: [res.data.result]}
        )})
        .catch((err) => this.setState({success:[], errors: [err]}))
    }
    
    render() {
        const {isLoading, showModal, typeModal, errors, success} = this.state;
        const { isAuth } = this.props.auth;

        if (isAuth){
            return <Redirect to={{pathname: '/browse'}} />
        }
        else {
            return( 
                <div className={isLoading ? "index loading": "index"} style={{'backgroundImage': `url("${process.env.PUBLIC_URL}/background.png")`}}>
                    <div className="index-container">
                        <h1 className="hypertube">Hypertube</h1>
                        <div className="button sign-up red big" onClick={() => { this.showModal('sign-up')}}>
                            Sign up for free ! 
                        </div>
                        <div className="button big sign-in" onClick={() => { this.showModal('sign-in')}}>
                            Sign In
                        </div>
                   </div>
                    { showModal && typeModal === 'sign-up' ? 
                        <Modal  show={showModal} 
                                handleClose={this.hideModal} 
                                children={<Register registerUser={this.registerUser} showModal={this.showModal} errors={errors} success={success}/>}
                        />: "" } 
                     { showModal && typeModal === 'sign-in'? 
                        <Modal  show={showModal} 
                                handleClose={this.hideModal} 
                                children={<Login logInUser={this.logInUser} showModal={this.showModal} errors={errors} success={success}/>}
                        />: "" } 
                    { showModal && typeModal === 'password'? 
                        <Modal  show={showModal} 
                                handleClose={this.hideModal} 
                                children={<PasswordForm submitCb={this.passwordUser} errors={errors} success={success}/>}
                    />: "" } 
        
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
export default connect(mapStateToProps)(Landing);
