import React from 'react'
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import authService from 'services/auth-service';
import { imgPath } from 'helpers';
import * as actions from 'store/actions';

const Text = require('../../helpers/languages');

class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      showRight: false,
    }
  }

  handleLogout() {
    this.props.logout();
    this.props.history.push('/');
  }

  showRight = () =>{
    this.setState({showRight: !this.state.showRight}); 
  }

  updateLanguage = (lang) => {
    if (lang !== this.props.user.language)
    {
      this.props.dispatch(actions.updateUser({language: lang}))
    }
  }
  render() {
    const { showRight } = this.state;
    const { user } = this.props;

    if (user || (authService.isAuthentificated() && user)){
      return (
        <div className="navbar-container">
          <nav className="my-navbar navbar">
            <div className="right-nav">
              <Link className="navbar-brand hypertube" to="/">Hypertube</Link>
              <Link to="/browse">{Text.browse[user.language]}</Link>
            </div>
            <div className="left-nav">
              <img  onClick={() => this.showRight()} src={imgPath(user.img)} alt="profile_img"/>
              <div className="logout" onClick={() => this.handleLogout()}>
              {Text.logout[user.language]}
              </div>
            </div>
          </nav>
          <div className={showRight ? "side-menu show" : "side-menu"}>
            <div className="header">
              <i className="fas fa-chevron-left close-side" onClick={() => this.showRight()}></i>
              <div className="header-info">
                <Link to={`/profile/${user.login}`}><img src={imgPath(user.img)} alt="profile_img"/></Link>
                <h1 className="firstname">{user.firstname}</h1>
                <h1 className="login">{user.login}</h1>
              </div>
              <div className="header-lang">
                <img className={user.language ==='en' ? 'active' : ''} src={`${process.env.PUBLIC_URL}/en.svg`} alt="en" onClick={() => this.updateLanguage('en')} />
                <img className={user.language ==='fr' ? 'active' : ''} src={`${process.env.PUBLIC_URL}/fr.svg`} alt="fr" onClick={() => this.updateLanguage('fr')}/>
                <img className={user.language ==='esp' ? 'active' : ''} src={`${process.env.PUBLIC_URL}/esp.svg`} alt="esp" onClick={() => this.updateLanguage('esp')}/>
              </div>
              <Link to={`/mylist`}>
                <div className="video-button transparent">{Text.list[user.language]}</div>
              </Link>
              <div>
              </div>
            </div>

            <div className="footer">
              <Link to="/users"><i className="fas fa-users"></i>{Text.users[user.language]}</Link>
              <div className="settings">
                <Link to="/settings"><i className="fas fa-cogs"></i>{Text.settings[user.language]}</Link>
                <i className="fas fa-door-closed" onClick={() => this.handleLogout()}></i>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else
      return null;
  }
}

function mapStateToProps(state) {
  return {
      auth: state.auth,
      user: state.user.data
  }
}
export default withRouter(connect(mapStateToProps)(Header));