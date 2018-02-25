import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import MeetingList from './meeting/';
import UserList from './user';
import List from './list';
import Setting from './setting';
import Charts from './charts';
import Monitor from './monitor';

import PropTypes from 'prop-types';
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
import fetch from 'lib/fetch';
import * as util from 'lib/util';

import './admin.less';
import './list.less';

class Admin extends React.Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    const { match } = this.props;
    return (
      <Layout className="admin-container">
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu
            // defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
        >
            <SubMenu key="sub1" title={<span><Icon type="desktop" /><span>会议室管理</span></span>}>
                <Menu.Item key="1"><Link to="/admin/meeting/area">区域管理</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/admin/meeting/department">部门管理</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/admin/meeting/rooms">会议室</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/admin/meeting/type">会议室类型</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                <Menu.Item key="5"><Link to="/admin/user/list">用户管理</Link></Menu.Item>
                <Menu.Item key="6"><Link to="/admin/user/role">角色管理</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title={<span><Icon type="setting" /><span>系统设置</span></span>}>
                <Menu.Item key="7"><Link to="/admin/setting/exchange">Exchange系统集成</Link></Menu.Item>
                <Menu.Item key="8"><Link to="/admin/setting/blacklist">黑名单</Link></Menu.Item>
                <Menu.Item key="9"><Link to="/admin/setting/whitelist">白名单</Link></Menu.Item>
                <Menu.Item key="10"><Link to="/admin/setting/roomsetting">会议室设置</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="13"><Link to="/admin/charts"><Icon type="pie-chart" /><span>报表分析</span></Link></Menu.Item>
            <Menu.Item key="14"><Link to="/admin/monitor"><Icon type="dot-chart" /><span>数据监控</span></Link></Menu.Item>
        </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Route path={`${match.url}/meeting/:type`} component={MeetingList}/>
            <Route path={`${match.url}/user/:type`} component={UserList}/>
            <Route path={`${match.url}/setting/`} component={Setting}/>
            <Route path={`${match.url}/charts`} component={Charts}/>
            <Route path={`${match.url}/monitor`} component={Monitor}/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

Admin.propTypes = {
  match: PropTypes.object.isRequired
}
export default Admin
