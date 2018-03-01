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
import AddAttendees from './addAttendees';

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

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
const curHour = moment().hours();
const startTimeConfig = {
  initialValue: moment().hours( curHour >=9 ? curHour + 1 : 9).minute(0),
  rules: [{
    type: 'object',
    required: true,
    message: 'Please select date!'
  }]
};

const endTimeConfig = {
  initialValue: moment().hours( curHour >=9 ? curHour + 1 : 9).minute(30),
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

/** 
 * 由于组件使用了antd的form表单（主要为使用它的表单验证功能），所以为了和其他页面保持数据同步，必须向redux发送一份一样的数据。
*/
class Appointment extends Component {
  state = {
    showAddRooms: false,
    showAddAttendees: false,
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
    this.props.form.validateFields((err, values) => {
      const data = values;
      if (!err) {
        // 处理参数
        data.receiver = data.receivers.join(';');
        delete data.receivers;
        data.startTime = data.startTime.clone().utc().format('YYYY-MM-DD HH:mm');
        data.endTime = data.endTime.clone().utc().format('YYYY-MM-DD HH:mm');
        data.roomMails = data.location.map(item => item.mail).join(';');
        delete data.location;
        data.showas = localStorage.getItem('__meeting_showas') || '';
        data.reminder = localStorage.getItem('__meeting_reminder') || 15;
        data.isPrivate = localStorage.getItem('__meeting_private') || false;
        data.importance = localStorage.getItem('__meeting_private') || '';
        fetch.post(`/api/meeting/add?token=${localStorage.getItem('__meeting_token') || ''}`, values).then(() => {
          message.success('预定成功');
          setTimeout(() => {
            location.href = '/home/mymeeting';
          })
        }).catch(() => {
          message.error('预定失败');
        });
      }

    });
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
          name: item.name,
          id: item.userId,
          mail: item.mail
        })),
        fetching: false
      });
    });
  }
  setValues = (props) => {
    const { startTime, endTime, location, receivers, content, subject } = props;
    this.props.form.setFieldsValue({
      startTime,
      endTime,
      location,
      receivers: receivers.map(item => item.mail),
      content,
      subject
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
    const userList = this.props.receivers.slice();
    const user = this.state.dataSource.find(item => item.mail == val);
    if(user) {
      userList.push(user);
    }
    this.props.form.setFieldsValue({
      receivers: userList.map(item => item.mail)
    });
    this.props.actions.changeProp('receivers', userList);
  }
  handelDeselect = (val) => {
    let userList = this.props.receivers;
    const index = userList.findIndex(item => item.mail === val);
    userList = userList.slice().splice(index, 1);
    this.props.form.setFieldsValue({
      receivers: userList.map(item => item.mail)
    });
    this.props.actions.changeProp('receivers', userList);
  }
  handleSelectRoom = (rooms) => {
    const location = this.props.location.concat(rooms);
    this.props.form.setFieldsValue({
      location
    });
    this.props.actions.changeProp('location', location);
  }
  handleTime(type, time) {
    const offsetUTC = this.state.timezone.label.split(' ')[0];

    if(type === 'startTime') {
        this.props.actions.changeProp('startTime', time);
        this.props.actions.changeProp('endTime', time.clone().add(30, 'minutes'));
        this.props.form.setFieldsValue({
          endTime: time.clone().add(30, 'minutes').zone(offsetUTC)
        });
    } else if(type === 'endTime') {
        this.props.actions.changeProp('endTime', time);
    }
  }
  handleChangeSubject = (e) => {
    this.props.actions.changeProp('subject', e.target.value);
  }
  handleContent = (e) => {
    this.props.actions.changeProp('content', e.target.value);
  }
  onSelectAttendee = (attendees) => {
    // 注意去重
    const list = this.props.receivers
    .filter(item => !this.props.receivers.find(e => item.value === e.value))
    .concat(attendees);
    // 发送给全局state
    this.props.actions.changeProp('receivers', list);
    // 发送给form
    this.props.form.setFieldsValue({
      receivers: list.map(item => item.mail),
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showTimezone } = this.props;
    const { showAddRooms, showAddAttendees, dataSource, fetching, timezone } = this.state;

    return (
      <div className="appointment-container">
        <div className="appoint-left">
          <div className="send-btn" onClick={e => {
            this.handleSubmit(e)
          }}>Send</div>
        </div>
        <div className="appoint-main">
          <AddAttendees
              visible={showAddAttendees}
              onClose={() => this.setState({ showAddAttendees: false })}
              onSelect={this.onSelectAttendee}
          />
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
                <Input placeholder="" disabled />
                )}
            </FormItem>
            <FormItem
              label={<Button style={{ width: 85 }} onClick={() => {
                this.setState({
                  showAddAttendees: true
                });
              }}>To...</Button>}
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
                  onDeselect={this.handelDeselect}
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
                  onSelect={this.handleSelectRoom}
                />
                {getFieldDecorator('location', {
                  initialValue: [],
                  rules: [{
                    type: 'array',
                    required: true,
                    message: 'Please input meeting room',
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
              {getFieldDecorator('startTime', startTimeConfig)(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                  disabledDate={disabledDate}
                  onChange={(date) => { this.handleTime('startTime',date) }}
                  className="my-date-picker"
                />
              )}
              {getFieldDecorator('startTime', startTimeConfig)(
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
              {getFieldDecorator('endTime', endTimeConfig)(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                  disabledDate={disabledDate}
                  onChange={(date) => { this.handleTime('endTime',date) }}
                  className="my-date-picker"
                />
              )}
              {getFieldDecorator('endTime', endTimeConfig)(
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
                <TextArea placeholder="Write some..." autosize={{ minRows: 6 }} onChange={this.handleContent} />
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

