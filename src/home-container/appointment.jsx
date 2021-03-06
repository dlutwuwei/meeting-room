import React, { Component } from 'react';
import { Form, Spin, message, Modal } from 'antd';
import { DatePicker, TimePicker } from 'components/pickers';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import moment from 'moment';
import fetch from 'lib/fetch';
import LocationRoom from 'components/location';
import { connect } from 'react-redux';
import _ from 'lodash'

import AddRooms from './addRooms';
import Timezone from '../constant/timezone';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import AddAttendees from './addAttendees';
import Recurrence from './recurrence';
const confirm = Modal.confirm;

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
const curMin = moment().minutes();
const initStartTime = moment().hours( curHour > 9 ? curHour : 9).minutes(curMin >= 30 ? 60 : 30);

const me = localStorage.getItem('__meeting_user_email');
const startTimeConfig = {
  initialValue: initStartTime,
  rules: [{
    type: 'object',
    required: true,
    message: 'Please select date!'
  }]
};

const endTimeConfig = {
  initialValue: initStartTime.add(30, 'minutes'),
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
    data: {},
    showAddRooms: false,
    showAddAttendees: false,
    showRecurrence: false,
    fetching: false,
    attendees: '',
    dataSource: [],
    loading: false,
    timezone: JSON.parse(localStorage.getItem('__meeting_timezone') || '{ "key": "CCT", "label": "08:00 中国北京时间（俄罗斯伊尔库茨克时区）"}')
  }
    
  componentDidMount() {
    this.handleTimezoneChange(this.state.timezone);
    setTimeout(() => {
      this.setValues(this.props);
    }, 0);
    document.addEventListener('dataChange', (e) => {
      let { key, value } = e.data;
      if(value._isAMomentObject) {
        const day = this.props[key].dayOfYear();
        value = value.clone().dayOfYear(day);
      }
      if(value) {
        this.props.actions.changeProp(key, value);
        this.props.form.setFieldsValue({
          [key]: value
        });
      }
    });
  }
  componentWillReceiveProps (nextProps) {
    if(this.props.recurrence_pattern !== nextProps.recurrence_pattern) {
      const data = this.state.data;
      data.recurrence_pattern = nextProps.recurrence_pattern;
      this.setState({
        data
      });
    }
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
        this.setState({
          loading: true
        });

        const setting = JSON.parse(localStorage.getItem('__meeting_setting') || '{}');
        const duration = data.endTime.diff(data.startTime, 'minutes');
        if(duration > setting.maxMeetingHour*60 + setting.maxMeetingMinutes) {
          message.error('預定時長超出限制');
          this.setState({
            loading: false
          });
          return;
        }
        if(setting.maxBookingDays < data.startTime.diff(new moment(), 'days')){
          message.error(`超出可預訂時間範圍，只允許預定${setting.maxBookingDays}天內的會議`);
          this.setState({
            loading: false
          });
          return;
        }
        const recurrenceJson =  localStorage.getItem('__meeting_recurrenceJson');
        if(recurrenceJson) {
          data.recurrenceJson = recurrenceJson;
          data.isRecurrence = true;
        } else {
          data.isRecurrence = false;
        }
        // 处理参数
        data.receiver = data.receivers.join(';');
        delete data.receivers;
        if(!data.receiver) {
          data.receiver = me;
        }
        data.startTime = data.startTime.clone().utc().format('YYYY-MM-DD HH:mm');
        data.endTime = data.endTime.clone().utc().format('YYYY-MM-DD HH:mm');
        data.roomMails = data.location.map(item => item.mail).join(';');
        delete data.location;
        data.showas = localStorage.getItem('__meeting_showas') || 2;
        data.reminder = localStorage.getItem('__meeting_reminder') || 15;
        data.isPrivate = localStorage.getItem('__meeting_private') || false;
        data.importance = localStorage.getItem('__meeting_important') || 1;
        if(this.props.isEdit) {
          data.id = this.props.editId;
        }
        confirm({
          title: 'Notice',
          width: 600,
          content: <div dangerouslySetInnerHTML={{ __html: setting.responseMessage || '' }} />,
          onOk: () => {
            this.sendAppointment(data)
          },
          onCancel: () => {
            this.setState({
              loading: false
            });
          }
        });

      }

    });
  }
  sendAppointment(data) {
    this.setState({
        loading: true
    })
    data.timezoneId = JSON.parse(localStorage.getItem('__meeting_timezone')).key;
    const url = this.props.isEdit ? '/api/meeting/update' : '/api/meeting/add'
    fetch.post(`${url}?token=${localStorage.getItem('__meeting_token') || ''}`, data).then(() => {
      message.success('預定成功');
      setTimeout(() => {
        location.href = '/home/mymeeting';
      });
      this.setState({
        loading: false
      });
      localStorage.setItem('__meeting_recurrenceJson', '');
    }).catch(() => {
      message.error('預定失败');
      this.setState({
        loading: false
      });
    });
  }
  handleSearch = (value) => {
    this.setState({
      fetching: true
    });
    fetch.get('/api/meeting/getAttenders', {
      keyword: value,
      token: localStorage.getItem('__meeting_token') || ''
    }).then((r) => {
      this.setState({
        dataSource: [{
          mail: value,
          id: '',
          name: value
        }].concat(r.data.list.map(item => ({
          name: item.name,
          id: item.userId,
          mail: item.mail
        }))),
        fetching: false
      });
    });
  }
  setValues = (props) => {
    // 修改表单所有值
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
    this.props.actions.changeProp('receiverOptions', userList);
    this.props.actions.changeProp('attendeesCheckedList', userList.map(item => item.mail));
  }
  handelDeselect = (val) => {
    let userList = this.props.receivers;
    const index = userList.findIndex(item => item.mail === val);
    userList = userList.slice();
    userList.splice(index, 1);
    this.props.form.setFieldsValue({
      receivers: userList.map(item => item.mail)
    });
    this.props.actions.changeProp('receivers', userList);
  }
  handleSelectRoom = (rooms) => {
    this.props.form.setFieldsValue({
      location: rooms
    });
    this.props.actions.changeProp('location', rooms);
    this.props.actions.changeProp('locationOptions', this.props.locationOptions.filter(item => {
      return item.mail !== rooms[0].mail; //去重
    }).concat(rooms));
    this.props.actions.changeProp('roomsCheckedList', rooms.map(item => item.mail));
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
    .filter(item => !attendees.find(e => item.mail === e.mail))
    .concat(attendees.filter(item => item.mail !== localStorage.getItem('__meeting_user_email')));
    // 发送给全局state
    this.props.actions.changeProp('receivers', list);
    this.props.actions.changeProp('receiverOptions', list);
    this.props.actions.changeProp('attendeesCheckedList', list.map(item => item.mail));
    // 发送给form
    this.props.form.setFieldsValue({
      receivers: list.map(item => item.mail),
    });
  }
  handleRecurrence = () => {
    // 单独获取重复预定信息
    fetch.get(`/api/meeting/getItem?`, {
      token: localStorage.getItem('__meeting_token') || '',
      id: this.props.editId
    }).then(r => {
      const { startTime, endTime } = r.data;
      r.data.startTime = moment(startTime*1000);
      r.data.endTime = moment(endTime*1000);

      this.setState({
        data: r.data
      }, () => {
        this.setState({
          showRecurrence: true
        });
      });
    }).catch(() => {
      message.error('獲取會議預定信息失敗')
    })
  }
  renderRecurrenceNotice = () => {
    const recurence = JSON.parse(localStorage.getItem('__meeting_recurrenceJson') || '{}');
    const { endDate, startDate, numberOfOccurrences } = recurence;
    if(!startDate) {
      return '';
    }
    let pattern = '';
    if(recurence.daily) {
        pattern = `Occurs every ${recurence.daily.everyWorkDay ? 'work day' : 'day'}`;
    } else if(recurence.weekly) {
        pattern = `Occurs every ${recurence.weekly.everyWeeks} weeks`;
    } else if(recurence.monthly) {
        pattern = `Occurs every month`;
    } else if(recurence.yearly) {
        pattern = `Occurs every year`;
    }
    if(numberOfOccurrences) {
        return `${pattern}, effective ${numberOfOccurrences} times after ${startDate}`;
    } else if(recurence.endDate) {
        return `${pattern}, effective ${startDate} util ${endDate}`;
    } else {
        return `${pattern}, effective ${startDate}`;
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showTimezone, isEdit, startTime, endTime, isRecurrence } = this.props;
    const { showAddRooms, showAddAttendees, dataSource, fetching, timezone, showRecurrence } = this.state;
    const offsetUTC = timezone.label.split(' ')[0];
    return (
      <Spin spinning={this.state.loading}>
        <div className="appointment-container">
          <div className="appoint-left">
            <div className="send-btn" onClick={e => {
              this.handleSubmit(e)
            }}>Send</div>
            {isEdit && <Button style={{marginTop: 20}} onClick={this.handleRecurrence}>Recurrence</Button>}
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
                    required: false,
                    message: 'Please input attendees',
                  }]
                })(
                  <Select
                    mode="multiple"
                    placeholder="Please select attendees!"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSelect={this.handleRecevierSelect}
                    onSearch={_.debounce(this.handleSearch, 800)}
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
                    defaultCapacity={this.props.receivers.length + 1}
                    startTime={startTime.zone(offsetUTC)}
                    endTime={endTime.zone(offsetUTC)}
                    changeProp={this.props.actions.changeProp}
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
                    disabled={isRecurrence}
                  />
                )}
                {getFieldDecorator('startTime', startTimeConfig)(
                  <TimePicker
                    format="HH:mm"
                    prefixCls="ant-time-picker"
                    placeholder="Select Time"
                    showSecond={false}
                    hideDisabledOptions={true}
                    disabled={isRecurrence}
                    disabledHours={() => {
                      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23];
                    }}
                    disabledMinutes={() => {
                      return generateOptions(60, (m) => {
                        return m % 10 !== 0
                      });
                    }}
                    style={{ verticalAlign: 'middle'}}
                    onChange={(date) => { this.handleTime('startTime',date) }}
                    allowEmpty={false}
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
                    disabled={isRecurrence}
                  />
                )}
                {getFieldDecorator('endTime', endTimeConfig)(
                  <TimePicker
                    format="HH:mm"
                    prefixCls="ant-time-picker"
                    placeholder="Select Time"
                    showSecond={false}
                    hideDisabledOptions={true}
                    disabled={isRecurrence}
                    disabledHours={() => {
                      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23];
                    }}
                    style={{ verticalAlign: 'middle' }}
                    disabledMinutes={() => {
                      return generateOptions(60, (m) => {
                        return m % 30 !== 0
                      });
                    }}
                    onChange={(date) => { this.handleTime('endTime',date) }}
                    allowEmpty={false}
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
              <div className="recurrence-notice">{isRecurrence && this.renderRecurrenceNotice()}</div>
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
        <Recurrence
            visible={showRecurrence}
            onClose={() => this.setState({ showRecurrence: false})}
            data={this.state.data}
            isEdit={isEdit}
            changeProp={this.props.actions.changeProp}
        />
      </Spin>
    )
  }
}


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

Appointment.defaultProps = {
  isEdit: false
}

Appointment.propTypes = {
  actions: PropTypes.object.isRequired,
  startTime: PropTypes.object.isRequired,
  endTime: PropTypes.object.isRequired,
  showTimezone: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  isEdit: PropTypes.bool
}

const WrappedDynamicRule = connect(mapStateToProps, mapDispatchToProps)(Appointment);

export default Form.create()(WrappedDynamicRule);
