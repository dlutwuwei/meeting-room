import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';
import homeReducer from './redux/home-redux';
import fetch from 'lib/fetch';

import './style/index.css';
import Home from './containers/home';
import Topics from './containers/topics';
import About from './containers/about';

const store = createStore(homeReducer, {}, applyMiddleware(thunkMiddleware, logger));

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <div className="main">
        <Route path="/home" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/topics" component={Topics}/>
      </div>
    </Router>
  </Provider>), document.getElementById('root'));


import * as util from 'lib/util';
const token = util.getQuery('token');

fetch.get('/api/user/getUserInfo', {
  token: token || '40a56c3e9cc9465f60c810f2d26d38c'
}).then(r => {
  localStorage.setItem('__meeting_user_email', r.data.mail);
  localStorage.setItem('__meeting_user_name', r.data.userName);
});

localStorage.setItem('__meeting_token', token || '40a56c3e9cc9465f60c810f2d26d38c')




import registerServiceWorker from './registerServiceWorker';
registerServiceWorker();
