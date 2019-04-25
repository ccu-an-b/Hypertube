import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker();