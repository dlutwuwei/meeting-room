import React from 'react';
import logo from 'img/logo.png';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import { hello } from '../redux/home-redux';
import '../style/home.less';

const TabPane = Tabs.TabPane;

const Home = () => (
  <div>
    <header className="app-header">
      <img src={logo} className="app-logo" alt="logo" />
    </header>
    <div className="app-main card-container">
      <Tabs type="card">
        <TabPane className="pane" tab="New Meeting" key="1">New Meeting</TabPane>
        <TabPane className="pane"tab="My Meeting" key="2">My Meeting</TabPane>
        <TabPane className="pane" tab="Tourist" key="3">Tour</TabPane>
      </Tabs>
    </div>
  </div>
)

const mapStateToProps = state => ({
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      hello
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
