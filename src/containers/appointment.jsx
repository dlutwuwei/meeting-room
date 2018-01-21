import React, { Component } from 'react';
import { DatePicker, Form, AutoComplete, Spin } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import fetch from 'lib/fetch';
import LocationRoom from 'components/location';
import AddRooms from './addRooms';

import '../style/appointment.less';
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

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
    dataSource: []
  }
  openRooms() {
    this.setState({
      showAddRooms: true
    });
  }
  handleSubmit(e) {
    const { dataSource } = this.state;
    this.props.form.validateFields((err, values) => {
      const data = values;
      if (!err) {
        data.receiver = data.receivers.join(';');
        delete data.receivers;
        data.startTime = data.startDate.format('YYYY-MM-DD') + ' ' + data.startTime.format('HH:mm');
        delete data.startDate;
        data.endTime = data.endDate.format('YYYY-MM-DD') + ' ' + data.endTime.format('HH:mm');
        delete data.endDate;
        data.location = data.location.map(item => item.mail).join(';');
        data.showas = localStorage.getItem('__showas') || '';
        data.reminder = localStorage.getItem('__reminder') || 15;
        fetch.post('/api/meeting/add?token=40a56c3e9cc9465f60c810f2d26d38c', values).then(r => {
        }).catch(err => {
          message.error(err.message);
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
      token: '40a56c3e9cc9465f60c810f2d26d38c'
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
  onSelectRoom = (rooms) => {
    this.props.form.setFieldsValue({
      'location': rooms
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { showAddRooms, dataSource, fetching } = this.state;
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
                initialValue: 'wuwei@meeting.com',
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
                  placeholder="Please select favourite colors"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
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
                <Input placeholder="" />
                )}
            </FormItem>
            <FormItem
              label="Location"
              {...formItemLayout}
            >
              <div className="item">
                <AddRooms
                  visible={showAddRooms}
                  onClose={() => this.setState({ showAddRooms: false})}
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
              {getFieldDecorator('startDate', dateConfig)(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                  onChange={() => { }}
                  onOk={() => { }}
                  className="my-date-picker"
                />
              )}
              {getFieldDecorator('startTime', timeConfig)(
                <TimePicker
                  prefixCls="ant-time-picker"
                  placeholder="Select Time"
                  showSecond={false}
                  hideDisabledOptions={true}
                  disabledHours={(h) => {
                    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23];
                  }}
                  disabledMinutes={(m) => {
                    return generateOptions(60, (m) => {
                      return m % 30 !== 0
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem
              label="End Time"
              {...formItemLayout}
            >
              {getFieldDecorator('endDate', dateConfig)(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                  onChange={() => { }}
                  onOk={() => { }}
                  className="my-date-picker"
                />
              )}
              {getFieldDecorator('endTime', timeConfig)(
                <TimePicker
                  prefixCls="ant-time-picker"
                  placeholder="Select Time"
                  showSecond={false}
                  hideDisabledOptions={true}
                  disabledHours={(h) => {
                    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23];
                  }}
                  disabledMinutes={(m) => {
                    return generateOptions(60, (m) => {
                      return m % 30 !== 0
                    });
                  }}
                />
              )}
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
                <TextArea placeholder="Write some..." autosize={{ minRows: 6 }} />
                )}
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

const WrappedDynamicRule = Form.create()(Appointment);

export default WrappedDynamicRule