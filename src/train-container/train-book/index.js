import React, { Fragment } from "react";
import {
  Menu,
  Icon,
  DatePicker,
  Table,
  Modal,
  message,
  Radio,
  Select,
  Checkbox
} from "antd";
import { Link, Route } from "react-router-dom";
const { RangePicker } = DatePicker;
const Option = Select.Option;
import Fetch from "../../lib/fetch";
import classnames from "classnames";
import Moment from "moment";
const RadioGroup = Radio.Group;
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
import * as URL from "../url";

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
const dateFormat = "YYYY-MM-DD";
class FormItem extends React.Component {
  render() {
    const {
      type = "value",
      label,
      value,
      readOnly = false,
      options,
      name,
      ref,
      onChange
    } = this.props;
    let inputDom = (
      <input
        name={name}
        type={type}
        defaultValue={value}
        readOnly={readOnly}
        onChange={value => onChange(name, value)}
        className="right"
        ref={ref}
      />
    );
    if (type === "radio") {
      inputDom = (
        <RadioGroup
          options={options}
          defaultValue={value}
          name={name}
          ref={ref}
          className="right"
          onChange={onChange}
        />
      );
    } else if (type === "select") {
      inputDom = (
        <Select
          defaultValue={value}
          style={{ width: 120 }}
          onChange={onChange}
          className="right"
        >
          {options.map(({ label, value }) => (
            <Option value={value}>{label}</Option>
          ))}
        </Select>
      );
    } else if (type === "checkbox") {
      inputDom = (
        <Checkbox
          name={name}
          defaultValue={value}
          className="right"
          ref={ref}
        />
      );
    }
    return (
      <div className="form-item">
        <label className="left">{label}</label>
        {inputDom}
      </div>
    );
  }
}
function EditCell(props) {
  const { text, onClick, record } = props;
  if (text == null) {
    return null;
  }
  const {
    afternoonReservationName,
    afternoonId,
    morningReservationName,
    morningId,
    isFestival,
    theDate
  } = text;
  const { lockState, isAllowMeBooking } = record;
  let am_status = AVALIABLE;
  let pm_status = AVALIABLE;
  if (morningId) {
    am_status = BOOKED;
  }
  if (afternoonId) {
    pm_status = BOOKED;
  }
  if (lockState) {
    am_status = LOCKED;
    pm_status = LOCKED;
  }
  if (isFestival) {
    am_status = HOLIDAY;
    pm_status = HOLIDAY;
  }
  const am_style = {
    backgroundColor: colorMap[am_status]
  };
  const pm_style = {
    backgroundColor: colorMap[pm_status]
  };
  return (
    <div className="book-day">
      <span
        style={am_style}
        onClick={() =>
          onClick({
            date: moment(1000 * theDate).format(dateFormat),
            period: 1
          })
        }
        className="book-am"
      >
        {morningReservationName}
      </span>
      <div className="divider" />
      <span
        style={pm_style}
        onClick={() =>
          onClick({
            date: moment(1000 * theDate).format(dateFormat),
            period: 2
          })
        }
        className="book-pm"
      >
        {afternoonReservationName}
      </span>
    </div>
  );
}
export default class Train extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [moment(), moment().add(7, "days")],
      train_list: [],
      selected_train: {},
      selected_day: {
        date: "",
        period: ""
      },
      brand_info: [],
      brandMap: {},
      divisionMap: {},
      showModal: false,
      form_info: {}
    };
    Fetch.get(URL.train_brand_list, {
      token: localStorage.getItem("__meeting_token")
    }).then(result => {
      const data = result.data;
      const brand_info = {};
      const brandMap = {};
      const divisionMap = {};
      for (const item of data.list) {
        const brand_id = item.id;
        const brand_name = item.name;
        brandMap[brand_name] = brand_id;
        brand_info[brand_name] = [];
        for (const division of item.BrandDivisions) {
          brand_info[brand_name].push(division.name);
          divisionMap[division.name] = division.id;
        }
      }
      this.setState({
        brand_info: brand_info,
        brandMap,
        divisionMap
      });
    });
  }
  updateForm = (name, e) => {
    /*
    const { selected_train } = this.state;
    selected_train[name] = e.target.value;
    this.setState({
      selected_train
    });
    */
  };
  formatTrainData(train_list) {}
  get formInfo() {
    const { selected_train, selected_day } = this.state;
    const { roomName, floor, capacity, deviceNames } = selected_train;
    const { name, mail, tel, department } = window.userInfo || {};
    const room_info = [
      {
        name: "roomName",
        label: "培训教室名称",
        value: roomName,
        readOnly: true
      },
      {
        name: "floor",
        label: "培训教室位置",
        value: floor,
        readOnly: true
      },
      {
        name: "capacity",
        label: "可容纳人数",
        value: capacity,
        readOnly: true
      },
      {
        name: "deviceNames",
        label: "培训教室设备",
        value: deviceNames,
        readOnly: true
      }
    ];
    const user_info = [
      {
        name: "name",
        label: "预订人姓名",
        value: name,
        readOnly: true
      },
      {
        name: "email",
        label: "预订人邮件",
        value: mail,
        readOnly: true
      },
      {
        name: "phone",
        label: "预订人联系电话",
        value: tel,
        readOnly: true
      },
      {
        name: "department",
        label: "预订人部门",
        value: department,
        readOnly: true
      }
    ];
    const {
      brandName,
      divisionName,
      subject,
      time,
      people,
      tea_break,
      lunch,
      memo
    } = selected_train;
    const { date } = selected_day;
    const { brandMap, divisionMap } = this.state;
    const brand_options = Object.keys(brandMap).map(x => ({
      label: x,
      value: x
    }));
    const division_options = Object.keys(divisionMap).map(x => ({
      label: x,
      value: x
    }));
    const train_info = [
      {
        name: "brandName",
        label: "使用品牌",
        type: "select",
        options: brand_options,
        value: brandName
      },
      {
        name: "divisionName",
        label: "使用部门",
        type: "select",
        options: division_options,
        value: divisionName,
        readOnly: true
      },
      {
        name: "subject",
        label: "培训主题",
        value: subject
      },
      {
        name: "date",
        label: "培训日期",
        value: date
      },
      {
        name: "time",
        label: "培训时间",
        value: time,
        type: "radio",
        options: [
          {
            label: "上半天(8:30-12:30)",
            value: 1
          },
          {
            label: "下半天(12:30-18:30)",
            value: 2
          }
        ]
      },
      {
        name: "people",
        label: "培训人数",
        value: people
      },
      {
        name: "teaBreaak",
        label: "需要茶歇时间",
        value: tea_break,
        type: "checkbox"
      },
      {
        name: "outLunch",
        label: "需要外出午餐",
        value: lunch,
        type: "checkbox"
      },
      {
        name: "remark",
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
    const { roomId, brandId } = this.state.selected_train;
    const { date, period } = this.state.selected_day;
    const formData = new FormData(form);
    formData.append("trainingRoomId", roomId);
    formData.append("brandId", brandId);
    formData.append("trainingDate", date);
    formData.append("trainingDate", date);
    formData.append("periodOfDay", period);
    formData.append("divisionId", 1);
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
      range: date
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
    Fetch.get(URL.train_book_list, {
      token: localStorage.getItem("__meeting_token"),
      startDate: range[0].format(dateFormat),
      endDate: range[1].format(dateFormat)
    }).then(result => {
      const data = result.data;
      this.setState({
        train_list: [...data.mine, ...data.others]
      });
    });
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
        <div className="book-table-container">{this.renderBookTable()}</div>
      </div>
    );
  }
  showBookModal = (selected_day, record) => {
    this.setState({
      selected_day,
      showModal: true,
      selected_train: record
    });
  };
  renderBookTable() {
    const range = this.getRange().map((x, idx) => {
      return {
        title: x,
        dataIndex: `scheduleList.${idx}`,
        className: "book-day-container",
        render: (text, record) => {
          return (
            <EditCell
              text={text}
              record={record}
              onClick={pick_day => this.showBookModal(pick_day, record)}
            />
          );
        }
      };
    });
    const columns = [
      {
        title: "品牌",
        dataIndex: "brandName",
        width: 100,
        fixed: "left"
      },
      {
        title: "楼层",
        dataIndex: "floor",
        width: 100,
        fixed: "left"
      },
      {
        title: "培训室（容纳人数)",
        dataIndex: "capacity",
        width: 100,
        fixed: "left"
      },
      ...range
    ];
    return (
      <Table
        scroll={{ x: 1500 }}
        dataSource={this.state.train_list}
        columns={columns}
        rowKey="roomId"
        className="book-table"
        bordered
      />
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
        <div className="form-header">培训室信息:</div>
        {room_info.map(config => (
          <FormItem {...config} onChange={this.updateForm} />
        ))}
      </div>
    );
    const user_dom = (
      <div className="user-container">
        <div className="form-header">预订人信息:</div>
        {user_info.map(config => (
          <FormItem {...config} onChange={this.updateForm} />
        ))}
      </div>
    );
    const train_dom = (
      <div className="train-contaienr">
        <div className="form-header">培训信息:</div>
        {train_info.map(config => (
          <FormItem {...config} onChange={this.updateForm} />
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
    Fetch.post(URL.train_create, {
      token: localStorage.getItem("__meeting_token"),
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
      <React.Fragment>
        {this.renderStage()}
        {this.renderModal()}
      </React.Fragment>
    );
  }
}
