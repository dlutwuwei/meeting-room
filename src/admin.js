import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'lib/fetch';

import {
    BrowserRouter as Router,
    Route
  } from 'react-router-dom';

import Admin from './admin-container';


import * as util from 'lib/util';
const token = util.getQuery('token');

fetch.get('/api/public/getCurrentUserInfo', {
  token: token || localStorage.getItem('__meeting_token')
}).then(r => {
  localStorage.setItem('__meeting_user_email', r.data.mail);
  localStorage.setItem('__meeting_user_name', r.data.userName);
});

token && localStorage.setItem('__meeting_token', token)

ReactDOM.render((
  <Router>
      <Route path="/admin" component={Admin}/>
  </Router>
), document.getElementById('root'));