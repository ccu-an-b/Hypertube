import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class NotFound extends React.Component {

    render() {
        return( 
            <div className="not-found">
                <h1 className="hypertube error">404</h1>
                <h2>page not found</h2>
                <Link to='/'><h3>Go back</h3></Link>
            </div>
        )
    }
}
export default withRouter((NotFound));