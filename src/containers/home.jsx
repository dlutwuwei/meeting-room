import React, { Component } from 'react'
import logo from 'img/logo.png';
import { Link, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import '../style/home.less';

import NewMeeting from './new-meeting';
import MyMeeting from './my-meeting';

const MAP = {
  'mymeeting': '2',
  'newmeeting':  '1'
}


class Home extends Component {
  state = {
    activeKey: MAP[this.props.match.params.type] || '1'
  }
  render() {
    const { match, location} = this.props;
    const path = location.pathname;
    const type =  path === "/home/mymeeting" ? 'mymeeting' : 'newmeeting';
    return (
      <div>
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <span style={{padding: '0 20px'}}>{localStorage.getItem('__meeting_user_name')}</span>
        </header>
        <div className="app-main card-container">
          <ul className="tabs">
            <li className={ type == 'newmeeting' ? "active" : ""}>
              <Link to={`${match.url}/newmeeting`}>
                New Meeting
              </Link>
            </li>
            <li className={ type == 'mymeeting' ? "active" : ''}>
              <Link to={`${match.url}/mymeeting`}>
                My Meeting
              </Link>
            </li>
          </ul>
          <div className="tabpanes">
            <Route exact path={`${match.url}`} component={NewMeeting}/>
            <Route path={`${match.url}/newmeeting`} component={NewMeeting}/>
            <Route path={`${match.url}/mymeeting`} component={MyMeeting}/>
          </div>
          {/* <Tabs type="card"
            activeKey={this.state.activeKey}
            onChange={(key) => {
              this.props.history.push(`/home/${ROUTE[key]}`);
              this.setState({
                activeKey: key
              });
            }}
          >
            <TabPane className="pane" tab="New Meeting" key="1"><NewMeeting /></TabPane>
            <TabPane className="pane" tab="My Meeting" key="2"><MyMeeting active={this.state.activeKey}/></TabPane>
          </Tabs> */}
        </div>
        <div className="app-footer">版权@2017</div>
      </div>
    )
  }
}

export default withRouter(Home);
