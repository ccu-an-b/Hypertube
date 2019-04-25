import React from 'react';
import RegisterForm from './RegisterForm';

export default class Register extends React.Component {
  render() {
    const {registerUser, showModal, errors, success} = this.props;

    return (
        <div className="form-container">
            <RegisterForm   submitCb={registerUser} 
                            switchModal={showModal} 
                            errors={errors} 
                            success={success}
            />
            <div className="oauth-container">
                <div className="or">
                    <span>Or</span>
                </div>
                <div className="social-container">
                    <a href="/auth/facebook"> 
                        <div className="social facebook">
                            <i className="fab fa-facebook-square"></i>
                            <h3>Sign in with Facebook</h3>
                        </div>
                    </a>
                    <a href="/auth/42">
                        <div className="social ecole">
                            <img src={process.env.PUBLIC_URL+"42_logo.svg"} alt="42_logo"/>
                            <h3>Sign up with 42</h3>
                        </div>
                    </a>
                    <a href="/auth/google"> 
                        <div className="social google">
                            <i className="fab fa-google-plus-g"></i>
                            <h3>Sign up with Google</h3>
                        </div>
                    </a>
                    <a href="/auth/github"> 
                        <div className="social github">
                            <i className="fab fa-github"></i>
                            <h3>Sign in with Github</h3>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
  }
}
