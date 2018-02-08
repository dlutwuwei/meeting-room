import React, { Component } from 'react';
import { Modal, DatePicker, TimePicker, Checkbox, Radio, Card } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import moment from 'moment';
import { generateOptions } from 'lib/util';
import fetch from 'lib/fetch';
import PropTypes from 'prop-types';
import Timezone from '../constant/timezone';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const children = [];
const zones = Object.keys(Timezone);
for (let i = 0; i < zones.length; i++) {
    const zone = Timezone[zones[i]]
    children.push(<Option key={i} value={zones[i]}>{zone}</Option>);
}


const durationOptions = new Array(12).fill('').map((item, i) => {
    return <Option key={i} value={i+1}>{(i+1)/2} hours</Option>
});
const eqOptions = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

function onChange() {
    
}
const columns = [{
    title: 'Room',
    dataIndex: 'name',
    key: 'room',
    render: text => <a href="#">{text}</a>,
  }, {
    title: 'Capacity',
    dataIndex: 'capacity',
    key: 'capacity',
  }, {
    title: 'Phone',
    dataIndex: 'hasPhone',
    key: 'phone',
  }, {
    title: 'TV',
    dataIndex: 'hasTv',
    key: 'tv',
  }, {
    title: 'Whiteboard',
    dataIndex: 'hasWhiteboard',
    key: 'whiteboard',
  }, {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
          <Checkbox/>
      </span>
    ),
  }];
  
class Recurrence extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        visible: false,
        list: [],
        openKeys: [],
        startTime: moment().hours(9).minutes(0),
        endTime: moment().hours(9).minutes(30),
        recurrence_pattern: '',
        recurrence: [],
        duration: 1,
        timezone: JSON.parse(localStorage.getItem('__meeting_timezone') || '{ "key": "CCT", "label": "08:00 中国北京时间（俄罗斯伊尔库茨克时区）"}')
    }
    search(startTime, endTime, equipment, capacity) {
        fetch.get('/api/meetingRoom/getList', {
            startTime,
            endTime,
            equipment,
            capacity,
            token: localStorage.getItem('__meeting_token') || ''
        }).then(r => {
            this.setState({
                list: r.data.list
            });
        });
    }
    componentDidMount() {
        this.search();
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }
    closeModal() {
        this.setState({
            visible: false
        });
        this.props.onClose();
    }
    handleTimezoneChange = (val) => {
        this.setState({
            timezone: val
        });
    }
    handleDuration = (val) => {
        this.setState({
            duration: val,
            endTime: this.state.startTime.clone().add(val*30, 'minutes')
        });
    }
    handleTime = (type, time) => {
        if(type === 'startTime') {
            this.setState({
                startTime: time
            });
        } else if(type === 'endTime') {
            this.setState({
                endTime: time,
                duration: time.diff(this.state.startTime, 'minutes')/30
            });
        }
    }
    render () {
        const { visible, list, timezone, startTime, endTime, duration } = this.state;
        const offsetUTC = timezone.label.split(' ')[0];
        return (
            <Modal
            title="Add Recurrence"
            style={{ top: 20 }}
            visible={visible}
            width={600}
            onOk={() => this.closeModal()}
            onCancel={() => this.closeModal()}
            footer={null}
            wrapClassName="add-recurrence-container"
            >
                <Card className="section" title={"Appointment Time"} bordered={false}>
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">Start Time:</label>
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            format="HH:mm"
                            showSecond={false}
                            value={startTime.zone(offsetUTC)}
                            onChange={this.handleTime.bind(this, 'startTime')}
                            hideDisabledOptions={true}
                            disabledHours={() => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={() => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                        />
                        <Select
                            size="default"
                            defaultValue={{key: 'CCT', label: Timezone['CCT']}}
                            value={timezone}
                            labelInValue
                            onChange={this.handleTimezoneChange}
                            style={{ width: 200, marginLeft: 20 }}
                        >
                            {children}
                        </Select>
                    </div>
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">End Time:</label>
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            value={endTime.zone(offsetUTC)}
                            format="HH:mm"
                            onChange={this.handleTime.bind(this, 'endTime')}
                            hideDisabledOptions={true}
                            disabledHours={() => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={() => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                        />
                        <Select
                            size="default"
                            defaultValue={{key: 'CCT', label: Timezone['CCT']}}
                            value={timezone}
                            labelInValue
                            onChange={this.handleTimezoneChange}
                            style={{ width: 200, marginLeft: 20 }}
                        >
                            {children}
                        </Select>
                    </div>
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">Duration:</label>
                        <Select
                            style={{width: 100}}
                            value={duration}
                            onChange={this.handleDuration}
                        >
                            {durationOptions}
                        </Select>
                    </div>
                </Card>
                <Card className="section" title={'Recurrence Pattern'} bordered={false}>
                    <div className="section-title"></div>
                    <div className="section-left">
                        <RadioGroup className="my-radio-group" onChange={onChange} value={this.state.value}>
                            <Radio value={1}>Daily</Radio>
                            <Radio value={2}>Weekly</Radio>
                            <Radio value={3}>Yearly</Radio>
                            <Radio value={4}>Monthly</Radio>
                        </RadioGroup>
                    </div>
                    <div className="section-right">
                        Recurrent every <Input /> week(s) on:
                        <CheckboxGroup options={eqOptions} defaultValue={['Apple']} onChange={onChange} />
                    </div>
                </Card>
                <Card className="section" title={'Recurrence Pattern'} bordered={false}>
                    <div className="section-left">
                        <label htmlFor="" className="room-title">Start Time:</label>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            onChange={() => {}}
                            onOk={() => {}}
                            className="my-date-picker"
                        />
                    </div>
                    <div className="section-right">
                        <RadioGroup className="my-radio-group" onChange={onChange} value={this.state.value}>
                            <Radio value={1}>Daily</Radio>
                            <Radio value={2}>Weekly <Input/> occurrence</Radio>
                            <Radio value={4}>Monthly
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="Select Date"
                                    onChange={() => {}}
                                    onOk={() => {}}
                                    className="my-date-picker"
                                />
                            </Radio>
                        </RadioGroup>
                    </div>
                </Card>
                <div className="rcu-item rcu-select">
                    <Button type="primary" size="large">OK</Button>
                    <Button type="info" size="large">Cancel</Button>
                    <Button type="default" size="large">Remove Recurrence</Button>
                </div>
            </Modal>
        )
    }
}

Recurrence.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}
export default Recurrence;