import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { Menu, Icon } from 'antd';
import TrainBook from "./train-book";
import TrainInfo from "./train-info";
import TrainSheet from "./train-sheet";

export default class TrainRoute extends Component {
  renderMenu() {
    return (
      <div className="menu-container">
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
          <Menu.Item key="sub4">
            <Link to={"/train/sheet"}>
              <Icon type="setting" />
              <span>统计报表</span>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
  renderStage() {
    return (
      <React.Fragment>
        <Route path={"/train/book"} component={TrainBook} />
        <Route path={"/train/info"} component={TrainInfo} />
        <Route path={"/train/sheet"} component={TrainSheet} />
      </React.Fragment>
    );
  }
  render() {
    return (
      <div className="train-container">
        {this.renderMenu()}
        {this.renderStage()}
      </div>
    );
  }
}
