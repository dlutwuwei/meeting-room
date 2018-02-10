import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route
  } from 'react-router-dom';

import Admin from './admin-container';
ReactDOM.render((
    <Router>
        <Route path="/admin" component={Admin}/>
    </Router>
), document.getElementById('root'));