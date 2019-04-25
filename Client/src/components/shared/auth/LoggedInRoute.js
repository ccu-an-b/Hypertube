import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import authService from 'services/auth-service';

export function LoggedInRoute(props){
    const {component: Component, ...rest} = props;

    return (
        <Route {...rest} render={(props) => authService.isAuthentificated()
            ? <Redirect to={{pathname: '/browse'}}/>
            : <Component {...props} {...rest}/>} />
    )
}
