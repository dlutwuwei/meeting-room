import 'babel-polyfill';

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

function getUrl(type) {
  switch (type) {
      case 'department':
          return '/api/department/getList';
      case 'area':
          return '/api/area/getList';
      case 'rooms':
          return '/api/meetingRoom/getList';
      case 'type':
          return '/api/meetingRoom/getRoomTypes';
  }
}



fetch.get('/api/public/getCurrentUserInfo', {
  token: token || localStorage.getItem('__meeting_token')
}).then(r => {
  localStorage.setItem('__meeting_user_email', r.data.mail);
  localStorage.setItem('__meeting_user_name', r.data.userName);
  localStorage.setItem('__meeting_user_actions', r.data.roleActions);

  // 预取数据
  Promise.all([fetch.get(getUrl('area'), {
      token: localStorage.getItem('__meeting_token')
  }), fetch.get(getUrl('department'), {
      token: localStorage.getItem('__meeting_token')
  }), fetch.get(getUrl('type'), {
      token: localStorage.getItem('__meeting_token')
  })]).then(([areas, departments, types]) => {
      localStorage.setItem('__meeting_areas', JSON.stringify(areas.data.list));
      localStorage.setItem('__meeting_department', JSON.stringify(departments.data.list));
      localStorage.setItem('__meeting_type', JSON.stringify(types.data));
      setTimeout(() => {
        ReactDOM.render((
          <Router>
              <Route path="/admin" component={Admin}/>
          </Router>
        ), document.getElementById('root'));
      }, 0);
  });

});

token && localStorage.setItem('__meeting_token', token)

