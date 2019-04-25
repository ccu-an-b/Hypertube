import React, { Component } from 'react';
import './App.css';

import {Provider} from 'react-redux';
import { BrowserRouter, Route} from 'react-router-dom';
import { LoggedInRoute } from 'components/shared/auth/LoggedInRoute' ;
import { ProtectedRoute } from 'components/shared/auth/ProtectedRoute' ;

import Play from 'components/play/Play';
import Landing from 'components/landing/Landing';
import Header from 'components/header/Header';
import Browse from 'components/browse/Browse';
import Auth from 'components/auth/Auth';
import Settings from 'components/settings/Settings';
import Profile from 'components/profile/Profile';
import NotFound from 'components/error/NotFound';
import MyList from 'components/mylist/MyList';
import Password from './components/password/Password';
import Users from './components/users/Users';
import * as actions from 'store/actions';
import authService from 'services/auth-service';

const store = require('store/reducers').init();

class App extends Component {
  
  componentWillMount(){
    this.checkAuthState();
    if (authService.isAuthentificated()){
      store.dispatch(actions.fetchUser())
    }
  }

  checkAuthState(){
    store.dispatch(actions.checkAuthState());
  }

  logout(){
    store.dispatch(actions.logout());
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>    
          <Header logout={this.logout}/>
          <div className="App">
            <LoggedInRoute exact path="/" component={Landing} />
            <LoggedInRoute exact path="/password/:key" component={Password} />
            <LoggedInRoute exact path="/token/:token" component={Auth} />
            <ProtectedRoute exact path="/browse" component={Browse} />
            <ProtectedRoute exact path="/settings" component={Settings} />
            <ProtectedRoute exact path="/profile/:username" component={Profile} />
            <ProtectedRoute exact path="/play" component={Play} />
            <ProtectedRoute exact path="/mylist" component={MyList} />
            <ProtectedRoute exact path="/users" component={Users} />
            <Route exact path="/:anything" component={NotFound} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;