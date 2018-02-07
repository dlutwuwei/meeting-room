import React, { Component } from 'react';
import { DatePicker, Form, Spin, message } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import fetch from 'lib/fetch';
import LocationRoom from 'components/location';
import { connect } from 'react-redux';
import AddRooms from './addRooms';
import Timezone from '../constant/timezone';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  changeProp
} from '../redux/home-redux';

import '../style/appointment.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

message.config({
  top: 300,
  duration: 2,
});

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const dateConfig = {
  initialValue: moment(),
  rules: [{
    type: 'object',
    required: true,
    message: 'Please select date!'
  }]
};

const timeConfig = {
  initialValue: moment().minute(0),
  rules: [{
    type: 'object',
    required: true,
    message: 'Please select time!'
  }]
};

const children = [];
const zones = Object.keys(Timezone);
for (let i = 0; i < zones.length; i++) {
  const zone = Timezone[zones[i]]
  children.push(<Option key={i} value={zones[i]}>{zone}</Option>);
}

function generateOptions(length, include) {
  const arr = [];
  for (let value = 0; value < length; value++) {
    if (include(value)) {
      arr.push(value);
    }
  }
  return arr;
}

class Appointment extends Component {
  state = {
    showAddRooms: false,
    fetching: false,
    attendees: '',
    dataSource: [],
    timezone: JSON.parse(localStorage.getItem('__meeting_timezone') || '{ "key": "CCT", "label": "08:00 中国北京时间（俄罗斯伊尔库茨克时区）"}')
  }
  openRooms() {
    this.setState({
      showAddRooms: true
    });
  }
  handleSubmit() {
    const { dataSource } = this.state;
    this.props.form.validateFields((err, values) => {
      const data = values;
      if (!err) {
        // 处理参数
        data.receiver = data.receivers.join(';');
        delete data.receivers;
        data.startTime = data.startDate.utc().format('YYYY-MM-DD') + ' ' + data.startTime.utc().format('HH:mm');
        delete data.startDate;
        data.endTime = data.endDate.utc().format('YYYY-MM-DD') + ' ' + data.endTime.utc().format('HH:mm');
        delete data.endDate;
        data.roomMails = data.location.map(item => item.mail).join(';');
        delete data.location;
        data.showas = localStorage.getItem('__meeting_showas') || '';
        data.reminder = localStorage.getItem('__meeting_reminder') || 15;
        data.isPrivate = localStorage.getItem('__meeting_private') || false;
        data.importance = localStorage.getItem('__meeting_private') || '';
        fetch.post(`/api/meeting/add?token=${localStorage.getItem('__meeting_token') || ''}`, values).then(r => {
          message.success('预定成功');
          setTimeout(() => {
            location.href = '/home?tab=my-meeting';
          })
        }).catch(() => {
          message.error('预定失败');
        });
      }

    });
    // this.props.form.validateFields(['to'], { force: true });
  }
  handleSearch = (value) => {
    this.setState({
      fetching: true
    });
    fetch.get('/api/user/getList', {
      keyword: value,
      token: localStorage.getItem('__meeting_token') || ''
    }).then((r) => {
      this.setState({
        dataSource: r.data.list.map(item => ({
          name: item.userName,
          id: item.userId,
          mail: item.mail
        })),
        fetching: false
      });
    });
  }
  setValues = (props) => {
    const { startTime, endTime } = props;
    this.props.form.setFieldsValue({
      startTime,
      endTime
    });

  }
  onSelectRoom = (rooms) => {
    this.props.form.setFieldsValue({
      'location': rooms
    });
  }
  componentDidMount() {
    this.handleTimezoneChange(this.state.timezone);
    this.setValues(this.props);
  }
  handleTimezoneChange = (val) => {
    this.setState({
      timezone: val
    });
    localStorage.setItem('__meeting_timezone', JSON.stringify(val));
    const offset = val.label.split(' ')[0];
    const { startTime, endTime } = this.props
    this.props.form.setFieldsValue({
      'startTime': startTime.zone(offset),
      'endTime': endTime.zone(offset)
    });
  }
  handleRecevierSelect = (val) => {
    const userList = JSON.parse(localStorage.getItem('__meeting_to') || '[]');
    const user = this.state.dataSource.find(item => item.mail = val);
    userList.push(user);
    localStorage.setItem('__meeting_to', JSON.stringify(userList));
  }
  handleTime(type, time) {
    if(type === 'startTime') {
        this.props.actions.changeProp('startTime', time);
    } else if(type === 'endTime') {
        this.props.actions.changeProp('endTime', time)
    }
    this.setValues(this.props);
  }
  handleChangeSubject = (e) => {
    this.props.actions.changeProp('subject', e.target.value);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showTimezone } = this.props;
    const { showAddRooms, dataSource, fetching, timezone } = this.state;

    return (
      <div className="appointment-container">
        <div className="appoint-left">
          <div className="send-btn" onClick={e => {
            this.handleSubmit(e)
          }}>Send</div>
        </div>
        <div className="appoint-main">
          <Form>
            <FormItem
              label={<Select defaultValue="1" style={{ width: 85 }}>
                <Option key="1" value="1">From</Option>
              </Select>}
              {...formItemLayout}
            >
              {getFieldDecorator('from', {
                initialValue: localStorage.getItem('__meeting_user_email'),
                rules: [{
                  type: 'string',
                  required: true,
                  message: 'Please input sender',
                }]
              })(
                <Input placeholder="wuwei@meeting.com" disabled />
                )}
            </FormItem>
            <FormItem
              label={<Button style={{ width: 85 }}>To...</Button>}
              {...formItemLayout}
            >
              {getFieldDecorator('receivers', {
                initialValue: [],
                rules: [{
                  type: 'array',
                  required: true,
                  message: 'Please input attendees',
                }]
              })(
                <Select
                  mode="multiple"
                  placeholder="Please select attendees!"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSelect={this.handleRecevierSelect}
                  onSearch={this.handleSearch}
                >
                  {dataSource.map((item, i) => <Option key={i} value={item.mail} title={item.id}>{item.mail}</Option>)}
                </Select>
                )}
            </FormItem>
            <FormItem
              label="Subject"
              {...formItemLayout}
            >
              {getFieldDecorator('subject', {
                initialValue: '',
                rules: [{
                  type: 'string',
                  required: true,
                  message: 'Please input subject',
                }]
              })(
                <Input placeholder="" onChange={this.handleChangeSubject} />
                )}
            </FormItem>
            <FormItem
              label="Location"
              {...formItemLayout}
            >
              <div className="item">
                <AddRooms
                  visible={showAddRooms}
                  onClose={() => this.setState({ showAddRooms: false })}
                  onSelect={this.onSelectRoom}
                />
                {getFieldDecorator('location', {
                  initialValue: [],
                  rules: [{
                    type: 'array',
                    required: true,
                    message: 'Please input attendees',
                  }]
                })(
                  <LocationRoom />
                  )}
                <div className="rooms" onClick={this.openRooms.bind(this)} />
              </div>
            </FormItem>
            <FormItem
              label="Start Time"
              {...formItemLayout}
            >
              {getFieldDecorator('startTime', dateConfig)(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                  onChange={(date) => { this.handleTime('startTime',date) }}
                  className="my-date-picker"
                />
              )}
              {getFieldDecorator('startTime', timeConfig)(
                <TimePicker
                  prefixCls="ant-time-picker"
                  placeholder="Select Time"
                  showSecond={false}
                  hideDisabledOptions={true}
                  disabledHours={() => {
                    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23];
                  }}
                  disabledMinutes={() => {
                    return generateOptions(60, (m) => {
                      return m % 30 !== 0
                    });
                  }}
                  onChange={(date) => { this.handleTime('startTime',date) }}
                />
              )}
              {showTimezone && <Select
                size="default"
                defaultValue={Timezone['CCT']}
                value={timezone}
                labelInValue
                onChange={this.handleTimezoneChange}
                style={{ width: 200, marginLeft: 20 }}
              >
                {children}
              </Select>}
            </FormItem>
            <FormItem
              label="End Time"
              {...formItemLayout}
            >
              {getFieldDecorator('endTime', dateConfig)(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                  onChange={(date) => { this.handleTime('endTime',date) }}
                  className="my-date-picker"
                />
              )}
              {getFieldDecorator('endTime', timeConfig)(
                <TimePicker
                  prefixCls="ant-time-picker"
                  placeholder="Select Time"
                  showSecond={false}
                  hideDisabledOptions={true}
                  disabledHours={() => {
                    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23];
                  }}
                  disabledMinutes={() => {
                    return generateOptions(60, (m) => {
                      return m % 30 !== 0
                    });
                  }}
                  onChange={(date) => { this.handleTime('endTime',date) }}
                />
              )}
              {showTimezone && <Select
                size="default"
                defaultValue={Timezone['CCT']}
                value={timezone}
                labelInValue
                onChange={this.handleTimezoneChange}
                style={{ width: 200, marginLeft: 20 }}
              >
                {children}
              </Select>}
            </FormItem>
            <div className="item">
              {getFieldDecorator('content', {
                initialValue: '',
                rules: [{
                  type: 'string',
                  required: false,
                  message: 'Please input attendees',
                }]
              })(
                <TextArea placeholder="Write some..." autosize={{ minRows: 6 }} onChange={val => {
                  localStorage.setItem('__meeting_content', val);
                }} />
                )}
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

const WrappedDynamicRule = Form.create()(Appointment);

// export default WrappedDynamicRule

const mapStateToProps = state => {
  return {
    ...state.navReducer,
    ...state.appointmentReducer
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
        changeProp
    }, dispatch)
  };
}

Appointment.propTypes = {
  actions: PropTypes.object.isRequired,
  startTime: PropTypes.object.isRequired,
  endTime: PropTypes.object.isRequired,
  showTimezone: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired
}
export default connect(mapStateToProps, mapDispatchToProps)(WrappedDynamicRule);

