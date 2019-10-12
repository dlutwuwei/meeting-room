import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'lib/fetch';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import Train from './train-container';

import * as util from 'lib/util';
const token = util.getQuery('token');

function getUrl(type) {
  switch (type) {
    case 'device':
      return '/api/device/getList';
    case 'brand':
      return '/api/brand/getList';
    case 'division':
      return '/api/division/getList';
    case 'admin':
      return '/api/brandAdmin/getList';
    case 'room':
      return '/api/trainingRoom/getList';
    case 'festival':
      return '/api/festival/getList';
  }
}

fetch
  .get('/api/public/getCurrentTrainUserInfo', {
    token: token || localStorage.getItem('__meeting_token'),
  })
  .then(userInfo => {
    localStorage.setItem('__meeting_user_email', userInfo.data.mail);
    localStorage.setItem('__meeting_user_name', userInfo.data.userName);
    window.userInfo = {
      name: userInfo.data.userName,
      mail: userInfo.data.mail,
    };
    Promise.all([
      fetch.get(getUrl('brand'), {
        token: localStorage.getItem('__meeting_token'),
      }),
      fetch.get(getUrl('division'), {
        token: localStorage.getItem('__meeting_token'),
      }),
      fetch.get(getUrl('device'), {
        token: localStorage.getItem('__meeting_token'),
      }),
    ]).then(([brand, division, device, userInfo]) => {
      localStorage.setItem('__meeting_brand', JSON.stringify(brand.data.list));
      localStorage.setItem(
        '__meeting_division',
        JSON.stringify(division.data.list)
      );
      localStorage.setItem(
        '__meeting_device',
        JSON.stringify(device.data.list)
      );

      ReactDOM.render(
        <Router>
          <Route path="/train" component={Train} />
        </Router>,
        document.getElementById('root')
      );
    });
  });

token && localStorage.setItem('__meeting_token', token);
