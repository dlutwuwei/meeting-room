import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { Menu, Icon } from "antd";
import fetch from 'lib/fetch';

import TrainBook from "./train-book";
import TrainInfo from "./train-info";
import TrainSheet from "./train-sheet";
import "./index.less";
const SubMenu = Menu.SubMenu;

export default class TrainRoute extends Component {
  renderMenu() {
    return (
      <div className="menu-container">
        <div className="logo" />
        <Menu
          theme={"dark"}
          onClick={this.handleClick}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          <Menu.Item key="sub1">
            <Link to={"/train/book"}>
              <Icon type="mail" />
              <span>培训室预定</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="sub2">
            <Link to={"/train/info"}>
              <Icon type="appstore" />
              <span>我的培训室</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub4"
            title={
              <span>
                <Icon type="pie-chart" />
                <span>统计报表</span>
              </span>
            }
          >
            <Menu.Item key="1">
              <Link to="/train/sheet/month">按月报表</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/train/sheet/total">总使用率报表</Link>
            </Menu.Item>
          </SubMenu>
          {/* <Menu.Item key="sub4">
            <Link to={"/train/sheet"}>
              <Icon type="setting" />
              <span>统计报表</span>
            </Link>
          </Menu.Item> */}
        </Menu>
      </div>
    );
  }
  renderStage() {
    const userInfo = window.userInfo || {};
    return (
      <React.Fragment>
        <div className="nav">
          <div className="user-name">{userInfo.userName}</div>
        </div>
        <Route path={"/train/book"} component={TrainBook} />
        <Route path={"/train/info"} component={TrainInfo} />
        <Route path={"/train/sheet/:type"} component={TrainSheet} />
        <Route exact path="/" component={TrainBook} />
      </React.Fragment>
    );
  }
  render() {
    return (
      <div className="train-container">
        <div className="layout-left">{this.renderMenu()}</div>
        <div className="layout-right">{this.renderStage()}</div>
      </div>
    );
  }
}
