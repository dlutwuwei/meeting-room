import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import MeetingList from './meeting/';
import UserList from './user';
import Setting from './setting';
import Charts from './charts';
import Usage from './charts/Usage'
import Manage from './charts/manage'
import Monitor from './monitor';
import Classroom from './classroom'
import PropTypes from 'prop-types';
import * as util from 'lib/util';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

import './admin.less';
import './list.less';

const KEY_MAP = {
  '/admin/meeting/area': '1',
  '/admin/meeting/department': '2',
  '/admin/meeting/rooms': '3',
  '/admin/meeting/type': '4',
  '/admin/user/list': '5',
  '/admin/user/role': '6',
  '/admin/setting/exchange': '7',
  '/admin/setting/whitelist': '9',
  '/admin/setting/blacklist': '8',
  '/admin/setting/roomsetting': '10',
  '/admin/monitor': '14',
  '/admin/classroom/device': '16',
  '/admin/classroom/division': '18',
  '/admin/classroom/brand': '17',
  '/admin/classroom/admin': '19',
  '/admin/classroom/room': '20',
  '/admin/classroom/festival': '21',
  '/admin/charts/rooms': '13',
  '/admin/charts/usage': '15',
  '/admin/meeting_manage': '16'
}

const isTrain = util.getQuery('isTrain');

const KEY_OPEN = {
  '/admin/meeting/area': 'sub1',
  '/admin/meeting/department': 'sub1',
  '/admin/meeting/rooms': 'sub1',
  '/admin/meeting/type': 'sub1',
  '/admin/user/list': 'sub2',
  '/admin/user/role': 'sub2',
  '/admin/setting/exchange': 'sub3',
  '/admin/setting/whitelist': 'sub3',
  '/admin/setting/blacklist': 'sub3',
  '/admin/setting/roomsetting': 'sub3',
  '/admin/classroom/device': 'sub4',
  '/admin/classroom/division': 'sub4',
  '/admin/classroom/brand': 'sub4',
  '/admin/classroom/admin': 'sub4',
  '/admin/classroom/room': 'sub4',
  '/admin/classroom/festival': 'sub4',
  '/admin/charts/rooms': 'sub5',
  '/admin/charts/usage': 'sub5',
}

const actions = localStorage.getItem('__meeting_user_actions') || '';
const permits = {};
actions.split(',').forEach(item => {
  permits[item] = true;
});

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
    const { match, location } = this.props;
    return (
      <Layout className="admin-container">
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          {window.show_logo ? <div className="logo" /> : <div className="nologo" />}
          <Menu
            defaultSelectedKeys={[KEY_MAP[location.pathname]]}
            defaultOpenKeys={[KEY_OPEN[location.pathname]]}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
        >
            {!isTrain && (permits['area'] || permits['department'] || permits['meetingRoom'] || permits['meetingType']) && <SubMenu key="sub1" title={<span><Icon type="desktop" /><span>会议室管理</span></span>}>
                { permits['area'] && <Menu.Item key="1"><Link to="/admin/meeting/area">区域管理</Link></Menu.Item>}
                { permits['department'] && <Menu.Item key="2"><Link to="/admin/meeting/department">部门管理</Link></Menu.Item>}
                { permits['meetingRoom'] && <Menu.Item key="3"><Link to="/admin/meeting/rooms">会议室</Link></Menu.Item>}
                { permits['meetingType'] && <Menu.Item key="4"><Link to="/admin/meeting/type">会议室类型</Link></Menu.Item>}
            </SubMenu>}
            {isTrain && <SubMenu key="sub4" title={<span><Icon type="folder" /><span>培训室管理</span></span>}>
                <Menu.Item key="16"><Link to="/admin/classroom/device?isTrain=true">设备管理</Link></Menu.Item>
                <Menu.Item key="17"><Link to="/admin/classroom/brand?isTrain=true">品牌管理</Link></Menu.Item>
                <Menu.Item key="18"><Link to="/admin/classroom/division?isTrain=true">部门管理</Link></Menu.Item>
                <Menu.Item key="19"><Link to="/admin/classroom/admin?isTrain=true">品牌管理员管理</Link></Menu.Item>
                <Menu.Item key="20"><Link to="/admin/classroom/room?isTrain=true">培训室管理</Link></Menu.Item>
                <Menu.Item key="21"><Link to="/admin/classroom/festival?isTrain=true">节假日管理</Link></Menu.Item>
            </SubMenu>}
            {!isTrain && (permits['user'] || permits['role']) && <SubMenu key="sub2" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                { permits['user'] && <Menu.Item key="5"><Link to="/admin/user/list">用户管理</Link></Menu.Item>}
                { permits['role'] && <Menu.Item key="6"><Link to="/admin/user/role">角色管理</Link></Menu.Item>}
            </SubMenu>}
            {!isTrain && (permits['SystemSetting'] || permits['blackList'] || permits['whiteList'] || permits['meetingRoomSetting']) && <SubMenu key="sub3" title={<span><Icon type="setting" /><span>系统设置</span></span>}>
                { permits['SystemSetting'] && <Menu.Item key="7"><Link to="/admin/setting/exchange">Exchange系统集成</Link></Menu.Item>}
                { permits['blackList'] && <Menu.Item key="8"><Link to="/admin/setting/blacklist">黑名单</Link></Menu.Item>}
                { permits['whiteList'] && <Menu.Item key="9"><Link to="/admin/setting/whitelist">白名单</Link></Menu.Item>}
                { permits['meetingRoomSetting'] && <Menu.Item key="10"><Link to="/admin/setting/roomsetting">会议室设置</Link></Menu.Item>}
            </SubMenu>}
            {!isTrain && permits['meetingManage'] && <Menu.Item key="16"><Link to="/admin/meeting_manage"><Icon type="book" /><span>会议管理</span></Link></Menu.Item>}
            {!isTrain && permits['report'] && <SubMenu key="sub5" title={<span><Icon type="pie-chart" /><span>报表分析</span></span>}>
              <Menu.Item key="13"><Link to="/admin/charts/rooms"><Icon type="database" /><span>会议室报表</span></Link></Menu.Item>
              <Menu.Item key="15"><Link to="/admin/charts/usage"><Icon type="table" /><span>使用率报表</span></Link></Menu.Item>
            </SubMenu>}
            {!isTrain && permits['deviceMonitor'] && <Menu.Item key="14"><Link to="/admin/monitor"><Icon type="dot-chart" /><span>设备监控</span></Link></Menu.Item>}
        </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <span style={{padding: '0 20px', float: 'right'}}>{localStorage.getItem('__meeting_user_name')}</span>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Route path={`${match.url}/meeting/:type`} component={MeetingList} />
            <Route path={`${match.url}/meeting_manage`} component={Manage} />
            <Route path={`${match.url}/user/:type`} component={UserList}/>
            <Route path={`${match.url}/classroom/:type`} component={Classroom}/>
            <Route path={`${match.url}/setting/`} component={Setting}/>
            <Route path={`${match.url}/charts/usage`} component={Usage}/>
            <Route path={`${match.url}/charts/rooms`} component={Charts}/>
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
