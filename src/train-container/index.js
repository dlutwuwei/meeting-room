import React, { Fragment } from "react";
import { Menu, Icon, DatePicker, Table, Modal, message } from "antd";
const { RangePicker } = DatePicker;
import Fetch from "../lib/fetch";
import classnames from "classnames";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import * as URL from "./url";

const STATE = {
  LOCKED: 0,
  AVALIABLE: 1,
  BOOKED: 2,
  HOLIDAY: 3
};
const { LOCKED, AVALIABLE, BOOKED, HOLIDAY } = STATE;
const colorMap = {
  [LOCKED]: "red",
  [AVALIABLE]: "green",
  [BOOKED]: "blue",
  [HOLIDAY]: "yellow"
};

import "./index.less";
const dateFormat = "YYYY/MM/DD";
function EditCell(props) {
  const { text, onClick } = props;
  const style = {
    backgroundColor: colorMap[text]
  };
  return <span style={style} onClick={onClick} />;
}
export default class Train extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [moment(), moment().add(7, "days")],
      train_list: [],
      selected_train: {},
      showModal: false,
      form_info: {}
    };
  }
  get formInfo() {
    const { selected_train } = this.state;
    const { name: train_name, floor, capacity, deviceNames } = selected_train;
    const { name, email, phone, department } = this.props;
    const room_info = [
      {
        label: "培训教室名称",
        value: train_name
      },
      {
        label: "培训教室位置",
        value: floor
      },
      {
        label: "可容纳人数",
        value: capacity
      },
      {
        label: "培训教室设备",
        value: deviceNames
      }
    ];
    const user_info = [
      {
        label: "预订人姓名",
        value: name
      },
      {
        label: "预订人邮件",
        value: email
      },
      {
        label: "预订人联系电话",
        value: phone
      },
      {
        label: "预订人部门",
        value: department
      }
    ];
    const {
      brandName,
      divisionName,
      subject,
      date,
      time,
      people,
      tea_break,
      lunch,
      memo
    } = selected_train;
    const train_info = [
      {
        label: "使用部门",
        value: divisionName
      },
      {
        label: "使用品牌",
        value: brandName
      },
      {
        key: "subject",
        label: "培训主题",
        value: subject
      },
      {
        label: "培训日期",
        value: date
      },
      {
        label: "培训时间",
        value: time
      },
      {
        label: "培训人数",
        value: people
      },
      {
        key: "teaBreaak",
        label: "茶歇时间",
        value: tea_break
      },
      {
        key: "outLunch",
        label: "外出午餐需求",
        value: lunch
      },
      {
        key: "remark",
        label: "备注",
        value: memo
      }
    ];
    return {
      room_info,
      user_info,
      train_info
    };
  }
  getFormData() {
    const form = document.querySelector(".form-container");
    const formData = new FormData(form);
    const obj = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  getRange() {
    const [start, end] = this.state.range;
    const range = moment.range(start, end);
    const range_list = [];
    for (const day of range.by("day")) {
      range_list.push(day.format(dateFormat));
    }
    return range_list;
  }
  updateRange = (date, dateString) => {
    this.setState({
      range: dateString
    });
    this.getRange(date[0], date[1]);
  };
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.range !== prevState.range) {
      this.fetchData();
    }
  }
  fetchData() {
    const { range } = this.state;
    Fetch.get(URL.train_query, {
      range
    }).then(result => {
      const data = result.data;
      this.setState({
        train_list: data.list
      });
    });
  }
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
            <span>
              <Icon type="mail" />
              <span>培训室预定</span>
            </span>
          </Menu.Item>
          <Menu.Item key="sub2">
            <span>
              <Icon type="appstore" />
              <span>我的培训室</span>
            </span>
          </Menu.Item>
          <Menu.Item key="sub4">
            <span>
              <Icon type="setting" />
              <span>统计报表</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
  renderLabel() {
    const label_items = [
      {
        content: "锁定中",
        label: "locked",
        color: "red"
      },
      {
        content: "可预订",
        label: "avaliable",
        color: "green"
      },
      {
        content: "已预订",
        label: "booked",
        color: "blue"
      },
      {
        content: "假日",
        label: "holiday",
        color: "yellow"
      }
    ];
    return (
      <div className="book-label-container">
        <ul className="book-label-list">
          {label_items.map(x => (
            <li className={classnames("book-item", x.label)} key={x.label}>
              <div
                className="label-block"
                style={{ backgroundColor: x.color }}
              />
              <div className="label-content">{x.content}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  renderTable() {
    return (
      <div className="table-container">
        <div className="date-pick">
          <RangePicker
            format={dateFormat}
            onChange={this.updateRange}
            defaultValue={this.state.range}
          />
        </div>
        <div className="book-table">{this.renderBookTable()}</div>
      </div>
    );
  }
  showBookModal = record => {
    this.setState({
      showModal: true,
      selected_train: record
    });
  };
  renderBookTable() {
    const range = this.getRange().map((x, idx) => {
      return {
        title: x,
        dataIndex: `state_list.${idx}`,
        className: "book-day",
        width: 100,
        render: (text, record) => (
          <EditCell
            text={text}
            record={record}
            onClick={() => this.showBookModal(record)}
          />
        )
      };
    });
    const columns = [
      {
        title: "品牌",
        dataIndex: "brandName",
        width: 100
      },
      {
        title: "楼层",
        dataIndex: "floor",
        width: 100
      },
      {
        title: "培训室（容纳人数)",
        dataIndex: "capacity",
        width: 100
      },
      ...range
    ];
    return (
      <Table dataSource={this.state.train_list} columns={columns} rowKey="id" />
    );
  }
  renderStage() {
    return (
      <div className="stage-container">
        {this.renderLabel()}
        {this.renderTable()}
      </div>
    );
  }
  renderModal() {
    const { showModal } = this.state;
    const { room_info, train_info, user_info } = this.formInfo;
    const room_dom = (
      <div className="room-container">
        <div>培训室信息</div>
        {room_info.map(({ label, value, key }) => (
          <div className="form-item" key={key}>
            <label className="left">{label}</label>
            <input
              name={key}
              type="value"
              defaultValue={value}
              ref={el => (this[key] = el)}
              className="right"
            />
          </div>
        ))}
      </div>
    );
    const user_dom = (
      <div className="user-container">
        <div>预订人信息</div>
        {user_info.map(({ label, value, key }) => (
          <div className="form-item" key={key}>
            <label className="left">{label}</label>
            <input
              name={key}
              type="value"
              defaultValue={value}
              ref={el => (this[key] = el)}
              className="right"
            />
          </div>
        ))}
      </div>
    );
    const train_dom = (
      <div className="train-contaienr">
        <div>培训信息</div>
        {train_info.map(({ label, value, key }) => (
          <div className="form-item" key={key}>
            <label className="left">{label}</label>
            <input
              name={key}
              type="value"
              defaultValue={value}
              ref={el => (this[key] = el)}
              className="right"
            />
          </div>
        ))}
      </div>
    );
    return (
      <Modal
        className="train-modal-container"
        visible={showModal}
        onOk={this.submit_book}
        onCancel={this.closeModal}
        okText={"预订"}
        cancelText={"取消"}
      >
        <form className="form-container">
          {room_dom}
          {user_dom}
          {train_dom}
        </form>
      </Modal>
    );
  }
  closeModal = () => {
    this.setState({
      showModal: false
    });
  };
  submit_book = () => {
    const data = this.getFormData();
    console.log("data:", data);
    Fetch.post(URL.train_create, {
      ...data
    }).then(
      () => {
        message.success("预订成功");
        this.closeModal();
      },
      err => {
        message.error("预订失败:", err.message);
      }
    );
  };
  render() {
    return (
      <div className="train-container">
        {this.renderMenu()}
        {this.renderStage()}
        {this.renderModal()}
      </div>
    );
  }
}
