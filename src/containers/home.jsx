import React, { Component } from 'react'
import logo from 'img/logo.png';
import { Tabs } from 'antd';
import * as util from 'lib/util';
import { withRouter } from 'react-router-dom';

import '../style/home.less';

const TabPane = Tabs.TabPane;

import NewMeeting from './new-meeting';
import MyMeeting from './my-meeting';

const MAP = {
  'mymeeting': '2',
  'newmeeting':  '1'
}

const ROUTE = {
  '1': 'newmeeting',
  '2': 'mymeeting'
}

class Home extends Component {
  state = {
    activeKey: MAP[this.props.match.params.type] || '1'
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
              this.props.history.push(`/home/${ROUTE[key]}`);
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

export default withRouter(Home);
