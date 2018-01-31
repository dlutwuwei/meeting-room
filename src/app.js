import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk';
import homeReducer from './redux/home-redux';

import './style/index.css';
import Home from './containers/home';
import Topic from './containers/topic';
import Topics from './containers/topics';
import About from './containers/about';
import Admin from './admin';

const store = createStore(homeReducer, {}, applyMiddleware(thunkMiddleware));

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <div className="main">
        <Route path="/admin" component={Admin}/>
        <Route path="/home" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/topics" component={Topics}/>
      </div>
    </Router>
  </Provider>), document.getElementById('root'));






import registerServiceWorker from './registerServiceWorker';
registerServiceWorker();
