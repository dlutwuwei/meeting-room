import React, { Component } from 'react'

import logo from 'img/logo.png';
import { Tabs } from 'antd';
import * as util from 'lib/util';
import fetch from 'lib/fetch';

import '../style/home.less';

const TabPane = Tabs.TabPane;

import NewMeeting from './new-meeting';
import MyMeeting from './my-meeting';

class Home extends Component {
  state = {
    activeKey: util.getQuery('tab') === 'my-meeting' ? '2' : '1'
  }
  render() {
    return (
      <div>
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
        </header>
        <div className="app-main card-container">
          <Tabs type="card"
            activeKey={this.state.activeKey}
            onChange={(key) => {
              this.setState({
                activeKey: key
              });
            }}
          >
            <TabPane className="pane" tab="New Meeting" key="1"><NewMeeting /></TabPane>
            <TabPane className="pane" tab="My Meeting" key="2"><MyMeeting /></TabPane>
          </Tabs>
        </div>
        <div className="app-footer">版权@2017</div>
      </div>
    )
  }
}

export default Home;

const token = util.getQuery('token');

fetch.get('/api/user/getUserInfo', {
  token: '40a56c3e9cc9465f60c810f2d26d38c'
}).then(r => {
  localStorage.setItem('__meeting_user_email', r.data.mail)
});

localStorage.setItem('__meeting_token', '40a56c3e9cc9465f60c810f2d26d38c')
