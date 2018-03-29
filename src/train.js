import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'lib/fetch';

import {
    BrowserRouter as Router,
    Route
  } from 'react-router-dom';

import Train from './train-container';


import * as util from 'lib/util';
const token = util.getQuery('token');
// ReactDOM.render((
//     <Router>
//         <Route path="/train" component={Train}/>
//     </Router>
//   ), document.getElementById('root'));


fetch.get('/api/public/getCurrentUserInfo', {
  token: token || localStorage.getItem('__meeting_token')
}).then(r => {
  localStorage.setItem('__meeting_user_email', r.data.mail);
  localStorage.setItem('__meeting_user_name', r.data.userName);

  ReactDOM.render((
    <Router>
        <Route path="/train" component={Train}/>
    </Router>
  ), document.getElementById('root'));
});

token && localStorage.setItem('__meeting_token', token)


