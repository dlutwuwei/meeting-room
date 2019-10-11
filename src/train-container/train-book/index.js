import React from "react";
import {
  DatePicker,
  Table,
  Modal,
  message,
  Radio,
  Select,
  Input,
  Icon,
  Checkbox,
  Spin,
  Tooltip,
  Popover
} from "antd";
const { RangePicker, WeekPicker } = DatePicker;
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
export class FormItem extends React.Component {
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
      <Input
        name={name}
        type={type}
        value={value}
        disabled={readOnly}
        onChange={e => onChange(name, e.target.value)}
        className="right"
        ref={ref}
      />
    );
    if (type === "radio") {
      inputDom = (
        <RadioGroup
          options={options}
          value={value}
          name={name}
          ref={ref}
          disabled={readOnly}
          className="right"
          onChange={e => onChange(name, e.target.value)}
        />
      );
    } else if (type === "select") {
      inputDom = (
        <Select
          value={value}
          onChange={value => onChange(name, value)}
          className="right"
        >
          {options.map(({ label, value }) => (
            <Option value={value} key={label}>{label}</Option>
          ))}
        </Select>
      );
    } else if (type === "checkbox") {
      inputDom = (
        <Checkbox
          name={name}
          checked={value || false}
          className="right"
          onChange={e => onChange(name, e.target.checked)}
          ref={ref}
        />
      );
    }
    return (
      <div className="form-item">
        <label className="left">{label}</label>
        <div className="item-right">{inputDom}</div>
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
    afternoonReservationId: afternoonId,
    morningReservationName,
    morningReservationInfo,
    afternoonReservationInfo,
    morningReservationId: morningId,
    isFestival,
    theDate
  } = text;
  const { lockState, isAllowMeBooking } = record;
  let am_status = AVALIABLE;
  let pm_status = AVALIABLE;
  if (lockState !== 1) {
    am_status = LOCKED;
    pm_status = LOCKED;
  }
  if (morningId) {
    am_status = BOOKED;
  }
  if (afternoonId) {
    pm_status = BOOKED;
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

  const content1 = morningReservationInfo ? Object.keys(morningReservationInfo || {}).map(key => <div>{key}:{morningReservationInfo[key]}</div> ) : '无预定信息'
  const content2 = afternoonReservationInfo ? Object.keys(afternoonReservationInfo || {}).map(key => <div>{key}:{afternoonReservationInfo[key]}</div>) : '无预定信息'
  return (
    <div className="book-day">
      <Popover content={content1} placement="topLeft" title="培训室预定">
        <span
          style={am_style}
          onClick={() => {
            if (lockState === 2) {
              Modal.confirm({
                title: __('解锁培训室'),
                okText: '预定',
                closable: true,
                cancelText: lockState !== 1 ? '解锁' : '锁定',
                onOk: () => {
                  onClick({
                    date: moment(1000 * theDate).format(dateFormat),
                    period: 1,
                    id: morningId
                  });
                },
                onCancel: () => {
                  record.lockState = 1
                }
              })
            } else if (am_status !== HOLIDAY && pm_status !== HOLIDAY) {
              onClick({
                date: moment(1000 * theDate).format(dateFormat),
                period: 1,
                id: morningId
              });
            }
          }}
          className="book-am"
        >
          {morningReservationName}
        </span>
      </Popover>
      <div className="divider" />
      <Popover content={content2} placement="topLeft" title="培训室预定">
        <span
          style={pm_style}
          onClick={() => {
            if (lockState === 2) {
              Modal.confirm({
                title: __('解锁培训室，点击‘确定’约定培训室，点击‘取消’解锁培训室'),
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                  onClick({
                    date: moment(1000 * theDate).format(dateFormat),
                    period: 2,
                    id: afternoonId
                  })
                },
                onCancel: () => {
                  record.lockState = 1
                }
              })
            } else if (am_status !== HOLIDAY && pm_status !== HOLIDAY) {
              onClick({
                date: moment(1000 * theDate).format(dateFormat),
                period: 2,
                id: afternoonId
              })
            }
          }}
          className="book-pm"
        >
          {afternoonReservationName}
        </span>
      </Popover>
    </div>
  );
}

export default class Train extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [
        moment().week(moment().week()).startOf('week').add(1, 'day'),
        moment().week(moment().week()).endOf('week').add(1, 'day')
      ],
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
      form_info: {},
      loading: false
    };
    // 获取所有品牌
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
  updateForm = (name, value) => {
    const { selected_train } = this.state;
    selected_train[name] = value;
    this.setState({
      selected_train
    });
  };
  get formInfo() {
    const { selected_train, selected_day } = this.state;
    // 培训室相关信息
    const {
      roomName,
      floor,
      deviceNames,
      brandName, // 品牌
      divisionName, // 部门
      subject, // 主题
      capacity,
      teaBreak,
      outLunch,
      remark,
    } = selected_train;
    // 选中方格信息（日期，中午，下午，全天）
    const { date, period } = selected_day;
    let { periodOfDay } = selected_train;
    if (!periodOfDay) {
      periodOfDay = period;
    }
    // 个人信息：姓名，邮箱，电话，部门
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


    const { brandMap, divisionMap } = this.state;
    const brand_options = Object.keys(brandMap).map(x => ({
      label: x,
      value: x
    }));
    const division_options = Object.keys(divisionMap).map(x => ({
      label: x,
      value: x
    }));
    let divisionName1 = divisionName || division_options.length ? division_options[0].value : ''
    const newSubject = (subject || '').replace(`${divisionName1 || ''}-${brandName}-`, '')
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
        value: divisionName1,
      },
      {
        name: "subject",
        label: "培训主题",
        value: `${divisionName1 || ''}-${brandName || ''}-${newSubject || ''}`,
      },
      {
        name: "date",
        label: "培训日期",
        value: date,
        readOnly: true
      },
      {
        name: "periodOfDay",
        label: "培训时间",
        value: periodOfDay,
        type: "radio",
        options: [
          {
            label: "上半天(8:30-12:30)",
            value: 1
          },
          {
            label: "下半天(12:30-18:30)",
            value: 2
          },
          {
            label: '全天',
            value: 3
          }
        ]
      },
      {
        name: "people",
        label: "培训人数",
        value: capacity
      },
      {
        name: "teaBreak",
        label: "需要茶歇时间",
        value: teaBreak,
        type: "checkbox"
      },
      {
        name: "outLunch",
        label: "需要外出午餐",
        value: outLunch,
        type: "checkbox"
      },
      {
        name: "remark",
        label: "备注",
        value: remark
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
    const { date } = this.state.selected_day;
    const formData = new FormData(form);

    formData.append("trainingRoomId", roomId);
    formData.append("brandId", brandId);
    formData.append("trainingDate", date);
    formData.append("divisionId", 1);
    const obj = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value === 'on' || value;
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
    this.fetchData(date);
  };
  componentDidMount() {
    this.fetchData(this.state.range);
  }
  fetchData(range) {
    this.setState({
      loading: true
    });
    Fetch.get(URL.train_book_list, {
      token: localStorage.getItem("__meeting_token"),
      startDate: range[0].format(dateFormat),
      endDate: range[1].format(dateFormat)
    }).then(result => {
      const data = result.data;
      if (data.mine) {
        data.mine.forEach(item => {
          item.isMine = true;
        })
      }
      this.setState({
        loading: false,
        train_list: [...data.mine, ...data.others]
      });
    }).catch(() => {
      message.error('日程查找失败');
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
  preWeek = () => {
    const [start, end] = this.state.range;
    this.setState({
      range: [start.subtract(1, 'weeks'), end.subtract(1, 'weeks')]
    });
    this.fetchData([start, end]);
  }
  nextWeek = () => {
    const [start, end] = this.state.range;
    this.setState({
      range: [start.add(1, 'weeks'), end.add(1, 'weeks')]
    });
    this.fetchData([start, end]);
  }
  renderTable() {
    const { loading } = this.state;
    return (
      <div className="table-container">
        <div className="date-pick">
          <Icon type="double-left" className="week-btn next-week" onClick={this.preWeek} />
          <WeekPicker
            format={dateFormat}
            value={this.state.range[0]}
            disabledDate={(date) => date.isBefore(moment())}
            onChange={this.handleWeekChange}
          />
          <span>至</span>
          <span>{this.state.range[1].format('YYYY-MM-DD')}</span>
          <Icon type="double-right" className="week-btn next-week" onClick={this.nextWeek} />
        </div>
        <div className="book-table-container">{loading ? <Spin className="train-loading" /> : this.renderBookTable()}</div>
      </div>
    );
  }
  handleWeekChange = (value) => {
    this.setState({
      range: [value, value.clone().add(1, 'weeks')]
    })
    this.fetchData([value, value.clone().add(1, 'weeks')]);

  }
  showBookModal = (selected_day, record) => {
    if (selected_day.id) {
      Fetch.get(URL.train_item, {
        token: localStorage.getItem("__meeting_token"),
        id: selected_day.id
      }).then(r => {
        this.setState({
          isEdit: true,
          selected_day,
          showModal: true,
          selected_train: {
            ...record,
            ...r.data
          }
        });
      });
    } else {
      this.setState({
        isEdit: false,
        selected_day,
        showModal: true,
        selected_train: record
      });
    }

  };
  renderBookTable() {
    const range = this.getRange().map((x, idx) => {
      const disable = moment(x).isBefore(moment())
      return {
        title: x,
        dataIndex: `scheduleList.${idx}`,
        className: "book-day-container",
        width: 100,
        render: (text, record) => {
          return (
            <EditCell
              text={text}
              record={record}
              onClick={pick_day => {
                if (!disable) {
                  this.showBookModal(pick_day, record)
                } else {
                  message.error('已经过期，不可预定')
                }
              }}
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
        title: "培训室",
        dataIndex: "roomName",
        width: 160,
        fixed: "left",
        render: (value, record) => {
          const content = (
            <div>
              <p>名称：{record.roomName}</p>
              <p>楼层：{record.floor}层</p>
              <p>容量：{record.capacity}人</p>
              <p>品牌：{record.brandName}</p>
              <p>设备：{record.deviceNames && record.deviceNames.map(item => item.name).join(' ')}</p>
            </div>
          );
          return <Popover content={content} placement="topLeft" class="training-cursor" title="培训室详情"><span>{value}</span></Popover>
        }
      },
      // {
      //   title: "楼层",
      //   dataIndex: "floor",
      //   width: 100,
      //   fixed: "left"
      // },
      // {
      //   title: "容纳人数",
      //   dataIndex: "capacity",
      //   width: 100,
      //   fixed: "left"
      // },
      ...range
    ];
    return (
      <Table
        size="small"
        scroll={{ x: 1500 }}
        dataSource={this.state.train_list}
        columns={columns}
        rowKey="roomId"
        className="book-table"
        bordered
        pagination={false}
      />
    );
  }
  renderStage() {
    return (
      <React.Fragment>
        <div className="stage-container">
          {this.renderLabel()}
          {this.renderTable()}
        </div>
      </React.Fragment>
    );
  }
  renderModal() {
    const { showModal, isEdit } = this.state;
    const { room_info, train_info, user_info } = this.formInfo;

    const room_dom = (
      <div className="room-container">
        <div className="form-header">培训室信息:</div>
        {room_info.map(config => (
          <FormItem {...config} onChange={this.updateForm} key={config.name} />
        ))}
      </div>
    );
    const user_dom = (
      <div className="user-container">
        <div className="form-header">预订人信息:</div>
        {user_info.map(config => (
          <FormItem {...config} onChange={this.updateForm} key={config.name} />
        ))}
      </div>
    );
    if (isEdit) {
      // 不允许修改预定时间
      train_info[4].readOnly = true;
    }
    const train_dom = (
      <div className="train-contaienr">
        <div className="form-header">培训信息:</div>
        {train_info.map(config => (
          <FormItem {...config} onChange={this.updateForm} key={config.name} />
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
        <div>
          <div className="form-title">{isEdit ? '编辑预定信息' : '培训室预定'}</div>
          <form className="form-container">
            {room_dom}
            {user_dom}
            {train_dom}
          </form>
        </div>
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

    const { isEdit, selected_day } = this.state;
    const { periodOfDay } = this.state.selected_train;
    // formdata无法识别radiobox groupd的值，这里重新赋值
    data.periodOfDay = periodOfDay || selected_day.period;
    if (isEdit) {
      data.id = selected_day.id;
    }
    Fetch.post(isEdit ? URL.train_update : URL.train_create, {
      token: localStorage.getItem("__meeting_token"),
      ...data
    }).then(
      () => {
        message.success(isEdit ? __("修改成功") : __("预订成功"));
        this.closeModal();
        // 更新数据
        this.fetchData(this.state.range);
      },
      err => {
        if (err.code === 20011) {
          message.error(__("预定时间冲突"), err.message);
        } else {
          message.error(isEdit ? __('修改失败') : __("预订失败"), err.message);
        }
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
