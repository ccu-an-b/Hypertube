import React from 'react';
import { connect } from 'react-redux';

import GeneralForm from './GeneralForm';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';

import * as actions from 'store/actions';
import userService from 'services/user-service';
import authService from 'services/auth-service';

const Text = require('../../helpers/languages');

export class Settings extends React.Component {
    _isMounted = false;
    constructor() {
        super();
        this.state = {
            errors:[],
            success:[],
            isLocal: false,
        }
    }

    componentDidMount(){
        this._isMounted = true;
        const isLocal = authService.isLocal();
        if(this._isMounted)
            this.setState({isLocal})
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateGeneral  = async (userData) => {
        const err = await this.props.dispatch(actions.updateUser(userData));
        
        if (err){
            this.setState({errors: {general: [err]}, success:[]});
            return false;
        }
        else
        {
            this.setState({errors: [], success: {general:['Your account has been modified']}})
            return true;
        }
    }

    updateProfile = async (userData) => {
        const profile_img = await userService.uploadImg(userData.img) 
        const err = await this.props.dispatch(actions.updateUser({img: profile_img}));

        if (err)
            this.setState({errors: {profile: [err]}, success:[]});
        else
            this.setState({errors: [], success: {profile:['Your account has been modified']}})
    }

    updatePassword = async (userData) => {
        const err = await userService.modifyPassword(userData);
        const {user} = this.props;
        
        if (err)
            this.setState({errors: {password: [err]}, success:[]});
        else
            this.setState({errors: [], success: {password:[Text.successPassword[user.language]]}})

    }
  
    render(){
        const {errors, success, isLocal} = this.state;
        const {user} = this.props;

        if (user){
            return (
                <div className= "settings-page">
                    <div className="settings-container">
                        <h1 className="page-title">{Text.account[user.language]}</h1>
                        <div className="settings-section">
                            <h2 className="settings-title">{Text.general[user.language]}</h2>
                            <GeneralForm    user={user}  
                                            errors={errors.general || []}  
                                            update={this.updateGeneral}/>
                        </div>
                        <div className="settings-section">
                            <h2 className="settings-title">{Text.profile[user.language]}</h2>
                            <ProfileForm    submitCb={this.updateProfile} 
                                            errors={errors.profile || []} success={success.profile} 
                                            defaultValue={user.img}
                                            user={user}/>
                        </div>
                       {isLocal && 
                            <div className="settings-section">
                                <h2 className="settings-title">{Text.password[user.language]}</h2>
                                <PasswordForm   submitCb={this.updatePassword} 
                                                errors={errors.password || []} 
                                                success={success.password || []}
                                                user={user}/>
                            </div>
                       }   
                    </div>
                </div>
            )   
        }
        else{
            return (
                <div className= "settings-page">
                    <div className="loading_gif">
                    <img src={`${process.env.PUBLIC_URL}/loading.gif`} alt="loading" />
                    </div>
                </div>
            )
        }
    }
}

function mapStateToProps(state){
    return {
        auth: state.auth,
        user: state.user.data,
        form: state.form
    }
}
export default connect(mapStateToProps)(Settings);