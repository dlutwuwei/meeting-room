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
import '../style/recurrence.less';

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
const eqOptions = [
    { label: '星期一', value: 1 },
    { label: '星期二', value: 2 },
    { label: '星期三', value: 3 },
    { label: '星期四', value: 4 },
    { label: '星期五', value: 5 },
    { label: '星期六', value: 6 },
    { label: '星期日', value: 0 },
];

function onChange() {
    
}
class Recurrence extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        visible: false,
        list: [],
        openKeys: [],
        startTime: moment().hours(9).minutes(0),
        endTime:  moment().hours(9).minutes(30),
        recurrence_pattern: 1,
        recurrence: [],
        duration: 1,
        timezone: JSON.parse(localStorage.getItem('__meeting_timezone') || '{ "key": "CCT", "label": "08:00 中国北京时间（俄罗斯伊尔库茨克时区）"}'),
        everyDays: 1,
        everyWeekDay: false,
        everyMonths: 0,
        dayOfMonth: 0,
        weekOfMonth: 0,
        dayOfWeek: 0,
        everyYear: 0,
        month: 0,
        everyWeeks: 0,
        daysOfTheWeek: 0
    }
    componentWillReceiveProps(props) {
        this.setState({
            visible: props.visible
        });
        if(props.visible) {
            this.setState({
                startTime: props.data.startTime,
                endTime: props.data.endTime
            });
        }
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
        }, () => {
            // this.props.changeProp('startTime', this.state.startTime);
            // this.props.changeProp('endTime', this.state.endTime);
        });
    }
    handleTime = (type, time) => {
        if(type === 'startTime') {
            this.setState({
                startTime: time
            });
            // this.props.changeProp('startTime', time);
        } else if(type === 'endTime') {
            this.setState({
                endTime: time,
                duration: time.diff(this.state.startTime, 'minutes')/30
            });
            // this.props.changeProp('endTime', time);
        }
    }
    onPatternChange = (e) => {
        this.setState({
            recurrence_pattern: e.target.value
        });
    }
    renderPattern(recurrence_pattern) {
        let pattern;
        switch(recurrence_pattern) {
            case 1:
                pattern = (
                    <RadioGroup  defaultValue={1} onChange={e => {
                        this.setState({
                            everyWeekDay: e.target.value == 2
                        });
                    }}>
                        <Radio value={1}>Every <Input defaultValue={1} onChange={(e) => {
                            this.setState({
                                everyDays: e.target.value
                            });
                        }}/> day(s)</Radio>
                        <Radio value={2}>Every work day</Radio>
                    </RadioGroup>
                );
                break;
            case 2:
                pattern = (<div>
                    Recurrent every <Input defaultValue={1} onChange={(e) => {
                        this.setState({
                            everyWeeks: e.target.value
                        });
                    }}/> week(s) on:
                    <CheckboxGroup options={eqOptions} defaultValue={[1]} onChange={(value) => {
                        this.setState({
                            daysOfTheWeek: value
                        })
                    }} />
                </div>);
                break;
            case 3:
                pattern = (<RadioGroup>
                    <Radio value={1}>Day <Input /> of every <Input /> month(s)</Radio>
                    <Radio value={2}>The <Select /> <Select /> of every <Input /> month(s)</Radio>
                </RadioGroup>);
                break;
            case 4:
                pattern = (<div>
                    <div style={{marginBottom: 6}}>重复间隔为<Input />年</div>
                    <RadioGroup>
                        <Radio value={1}>时间: <Select /> <Input />日</Radio>
                        <Radio value={2}>The <Select />的<Select /> <Select /></Radio>
                    </RadioGroup>
                </div>);
                break;
        }
        return pattern;
    }
    handleSubmit = () => {
        const { startTime, endTime } = this.props.data;

        const {
            everyDays,
            everyWeekDay,

            everyWeeks,
            daysOfTheWeek,

            everyMonths,
            dayOfMonth,
            weekOfMonth,
            dayOfWeek,
            everyYear,
            month,
            
            recurrence_pattern
        } = this.state;

        let recurrent_parma = {};
        switch(recurrence_pattern) {
            case 1:
                recurrent_parma = {
                    daily: {
                        everyDays,
                        everyWeekDay
                    }
                }
                break;
            case 2:
                recurrent_parma = {
                    weekly: {
                        everyWeeks,
                        daysOfTheWeek
                    }
                }
                break;
            case 3:
                recurrent_parma = {
                    monthly: {
                        everyMonths,
                        dayOfMonth,
                        weekOfMonth,
                        dayOfWeek,
                    }
                };
                break;
            case 4:
                recurrent_parma = {
                    yearly: {
                        everyYear,
                        month,
                        dayOfMonth,
                        weekOfMonth,
                        dayOfWeek,
                    }
                }
                break
        }
        fetch.post('/api/meeting/add?token='+ localStorage.getItem('__meeting_token'), {
            startTime: startTime.format('HH:mm'),
            endTime: endTime.format('HH:mm'),
            startDate: startTime.format('YYYY-MM-DD'),
            endDate: endTime.format('YYYY-MM-DD'),
            numberOfOccurrences: 1,
            length: 3,
            timeZone: 8,
            ...recurrent_parma
            // daily: {
            //     everyDays: 2,
            //     everyWeekDay: false
            // },
            // weekly: {
            //     everyWeeks: false,
            //     daysOfTheWeek: []
            // },
            // monthly: {
            //     everyMonths: 1,
            //     dayOfMonth:	1,
            //     weekOfMonth: 1,
            //     dayOfWeek: 0,
            //     isLunarCalendar: false,
            // },
            // yearly: {
            //     everyYear: 1,
            //     month: 1,
            //     dayOfMonth: 1,
            //     weekOfMonth: 2,
            //     dayOfWeek: 1,
            //     isLunarCalendar: false
            // }

        }).then(r => {
            this.setState({
                list: r.data.list
            });
        });
    }
    render () {
        const { visible, timezone, startTime, endTime, duration, recurrence_pattern } = this.state;
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
                <Card className="my-card" title={"Appointment Time"} bordered={false}>
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
                            style={{width: 150}}
                            value={duration}
                            onChange={this.handleDuration}
                        >
                            {durationOptions}
                        </Select>
                    </div>
                </Card>
                <Card className="my-card" title={'Recurrence Pattern'} bordered={false}>
                    <div className="section">
                        <div className="section-left" style={{flex: 1}}>
                            <RadioGroup className="my-radio-group" onChange={this.onPatternChange} value={this.state.recurrence_pattern}>
                                <Radio value={1}>Daily</Radio>
                                <Radio value={2}>Weekly</Radio>
                                <Radio value={3}>Monthly</Radio>
                                <Radio value={4}>Yearly</Radio>
                            </RadioGroup>
                        </div>
                        <div className="section-right" style={{flex: 2}}>
                            {this.renderPattern(recurrence_pattern)}
                        </div>
                    </div>
                </Card>
                <Card className="my-card" title={'Recurrence Scope'} bordered={false}>
                    <div className="section">
                        <div className="section-left" style={{flex: 2}}>
                            <label htmlFor="" style={{marginRight: 10}}>Start:</label>
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder="Select Date"
                                value={startTime.zone(offsetUTC)}
                                onChange={this.handleTime.bind(this, 'startTime')}
                                className="my-date-picker"
                            />
                        </div>
                        <div className="section-right">
                            <RadioGroup className="my-radio-group">
                                <Radio value={1}>No end date</Radio>
                                <Radio value={2}>End after: <Input/> occurrences</Radio>
                                <Radio value={3}>End by:
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
                    </div>
                </Card>
                <div className="rcu-item rcu-select">
                    <Button type="primary" size="large" style={{width: 100}} onClick={this.handleSubmit}>OK</Button>
                    <Button type="info" size="large" style={{width: 100}}>Cancel</Button>
                    <Button type="default" size="large">Remove Recurrence</Button>
                </div>
            </Modal>
        )
    }
}

Recurrence.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    changeProp: PropTypes.func.isRequired
}
export default Recurrence;