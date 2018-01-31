import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import './admin.less';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

const Topic = ({ match }) => (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  )

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
    return (
      <Layout className="admin-container">
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
        >
            <SubMenu key="sub1" title={<span><Icon type="desktop" /><span>会议室管理</span></span>}>
                <Menu.Item key="5">区域管理</Menu.Item>
                <Menu.Item key="6">部门管理</Menu.Item>
                <Menu.Item key="7">会议室</Menu.Item>
                <Menu.Item key="8">会议室设置</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="setting" /><span>系统设置</span></span>}>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
            <Menu.Item key="13"><Icon type="pie-chart" /><span>报表分析</span></Menu.Item>
            <Menu.Item key="14"><Icon type="dot-chart" /><span>数据监控</span></Menu.Item>
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
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

// class Admin extends Component {
//     render () {
//         const match = this.props.match;
//         return (
//             <div>
//                 <h2>Topics</h2>
//                 <Route path={`${match.url}/:topicId`} component={Topic}/>
//                 <Route exact path={match.url} render={() => (
//                 <h3>Please select a topic.</h3>
//                 )}/>
//             </div>
//         )
//     }
// }

export default Admin
