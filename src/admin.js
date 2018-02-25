import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'lib/fetch';

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

import * as util from 'lib/util';
const token = util.getQuery('token');

fetch.get('/api/user/getUserInfo', {
  token: token || localStorage.getItem('__meeting_token') || 'be9e4669497b5c236094e5ef21fd25'
}).then(r => {
  localStorage.setItem('__meeting_user_email', r.data.mail);
  localStorage.setItem('__meeting_user_name', r.data.userName);
});

localStorage.setItem('__meeting_token', token || 'be9e4669497b5c236094e5ef21fd25')
