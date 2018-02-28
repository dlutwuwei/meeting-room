import React, { Component } from 'react'
import Button from 'components/button';
import fetch from 'lib/fetch';
import AddRooms from './addRooms';
import AddAttendees from './addAttendees';
import moment from 'moment';
import classnames from 'classNames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox, DatePicker, Icon, message, Modal, Select } from 'antd';
import TimePicker from 'rc-time-picker';
import PropTypes from 'prop-types';

import '../style/schedule.less';
import Timezone from '../constant/timezone';
import {
    changeProp
} from '../redux/home-redux';

const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
const Option = Select.Option;

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
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

const children = [];
const zones = Object.keys(Timezone);
for (let i = 0; i < zones.length; i++) {
    const zone = Timezone[zones[i]]
    children.push(<Option key={i} value={zones[i]}>{zone}</Option>);
}

class Schedule extends Component {
    constructor() {
        super();
    }
    state = {
        // 计划表
        data: [[], [{
            status: 1,
            start: 2,
            end: 7
        }, {
            status: 3,
            start: 7,
            end: 12
        }], [{
            status: 4,
            start: 5,
            end: 7
        }, {
            status: 5,
            start: 8,
            end: 12
        }, {
            status: 2,
            start: 12,
            end: 15
        }], []],
        checkAll: false,
        checkedList: [],
        // 列表选型
        options: [
            // {
            //     label: localStorage.getItem('__meeting_user_name'),
            //     value: localStorage.getItem('__meeting_user_email')
            // }
        ],
        showAddRooms: false,
        showAddAttendees: false,
        date: moment().minutes(0),
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        timezone: JSON.parse(localStorage.getItem('__meeting_timezone') || '{ "key": "CCT", "label": "08:00 中国北京时间（俄罗斯伊尔库茨克时区）"}')
    }
    hover = false
    componentDidMount() {
        this.search(moment())
    }
    searchPev = () => {
        const { attendees, date } = this.state;
        this.search(date.subtract(1, 'd'), attendees);
    }
    searchNext = () => {
        const { attendees, date } = this.state;
        this.search(date.add(1, 'd'), attendees);
    }
    search(date) {
        this.setState({
            date
        });
        // fetch.get('/api/Schedule/getList', {
        //     users: JSON.stringify(users),
        //     date: date.clone().utc().format('YYYY-MM-DD'),
        //     token: localStorage.getItem('__meeting_token') || ''
        // }).then(r => {
        //     const AttendeesOptions = r.data.map(item => {
        //         return {
        //             value: item.id,
        //             label: item.userName
        //         }
        //     });
        //     r.data.forEach(item => item.selected = true)
        //     const checkedList = r.data.map(item => item.id);
        //     this.setState({
        //         data: r.data,
        //         options: AttendeesOptions,
        //         checkedList,
        //         checkAll: true
        //     })
        // });
    }
    onChange(checkedList) {
        this.setState({
            checkedList,
            checkAll: checkedList.length === this.state.options.length,
        });
    }
    onCheckAllChange(e) {
        const allOptions = this.state.options.map(item => item.value);
        this.setState({
            checkedList: e.target.checked ? allOptions : [],
            checkAll: e.target.checked,
        });
    }
    addToList(data) {
        const options = data.map(item => ({
            label: item.name,
            value: item.mail
        })).filter(item => {
            return !this.state.checkedList.find(ele => ele === item.value);
        });
        const newOptions = this.state.options.concat(options);
        this.setState({
            options: newOptions,
            checkedList: this.state.checkedList.concat(newOptions.map(item => item.value)),
            checkAll: true,
            data: this.state.data.concat(options.map(() => ([])))
        });
    }
    onSelectRoom(rooms) {
        this.setState({
            rooms
        });
        this.props.actions.changeProp('location', this.props.location.concat(rooms));
        this.addToList(rooms);
    }
    onSelectAttendee(attendees) {
        this.props.actions.changeProp('receivers', this.props.receivers.concat(attendees));
        this.addToList(attendees)
    }
    handleSend = () => {
        const { startTime, endTime, subject, receivers, content, location } = this.props;
        const data = {};
        data.content = content || '';
        data.subject = subject || '';
        data.from = localStorage.getItem('__meeting_user_email') || '';
        data.receiver = receivers.map(item => item.mail).join(';');
        data.roomMails = location.map(item => item.mail).join(';');
        data.startTime = startTime.utc().format('YYYY-MM-DD HH:mm');
        data.endTime = endTime.utc().format('YYYY-MM-DD HH:mm');
        data.showas = localStorage.getItem('__meeting_showas') || '';
        data.reminder = localStorage.getItem('__meeting_reminder') || 15;
        data.isPrivate = localStorage.getItem('__meeting_private') || false;
        data.importance = localStorage.getItem('__meeting_private') || '';
        localStorage.setItem('__appointment_data', JSON.stringify(data));
        if (!data.receiver || !data.roomMails) {
            Modal.error({
                title: '没有填写收件人或会议室',
            });
        } else if (!data.content || !data.subject) {
            confirm({
                title: '没有填写标题和内容，确认发送？',
                onOk: () => {
                    this.sendAppointment(data)
                },
                onCancel() {
                    // console.log('Cancel');
                }
            });
        } else {
            this.sendAppointment(data);
        }

    }
    sendAppointment(data) {
        fetch.post(`/api/meeting/add?token=${localStorage.getItem('__meeting_token') || ''}`, data).then(() => {
            message.success('预定成功');
            setTimeout(() => {
                location.href = '/home?tab=my-meeting';
            });
        }).catch(() => {
            message.error('预定失败');
        });
    }
    handleMouseDown = (x, y) => {
        // console.log('down', x, y, `${9+parseInt(x/2)}:${(x%2)*30}`)
        this.hover = true;
        const startTime = this.state.date.clone().hours(9 + parseInt(x / 2)).minutes((x % 2) * 30);
        this.setState({
            left: x,
            top: y,
            right: -1,
            bottom: -1
        });
        this.props.actions.changeProp('startTime', startTime);
    }
    handleMouseOver = (x, y) => {
        const endTime = this.state.date.clone().hours(9 + parseInt((x + 1) / 2)).minutes(((x + 1) % 2) * 30);
        if (this.hover) {
            this.setState({
                right: x,
                bottom: y
            });
            this.props.actions.changeProp('endTime', endTime);
        }
    }
    handleMouseUp = (x, y) => {
        this.hover = false;
        this.setState({
            right: x,
            bottom: y,
        });
        const endTime = this.state.date.clone().hours(9 + parseInt((x + 1) / 2)).minutes(((x + 1) % 2) * 30);
        this.props.actions.changeProp('endTime', endTime)
    }
    handleTimezoneChange = (val) => {
        this.setState({
            timezone: val
        });
        localStorage.setItem('__meeting_timezone', JSON.stringify(val));
    }
    handleTime(type, time) {
        if(type === 'startTime') {
            this.props.actions.changeProp('startTime', time.utc());
            this.props.actions.changeProp('endTime', time.clone().add(30, 'minutes').utc());
        } else if(type === 'endTime') {
            this.props.actions.changeProp('endTime', time.utc());
        }
    }
    render() {
        const { data, checkedList, date, showAddRooms,
            showAddAttendees, left, right, top,
            timezone } = this.state;
        const { startTime, endTime, showTimezone, receivers, location } = this.props;
        const offsetUTC = timezone.label.split(' ')[0];
        return (
            <div className="schedule-contianer">
                <div className="schedule-main">
                    <div className="schedule-left">
                        <div className="send-btn2" onClick={this.handleSend}>Send</div>
                        <div className="attendees">
                            <div className="select-all">
                                <Checkbox
                                    onChange={this.onCheckAllChange.bind(this)}
                                    checked={this.state.checkAll}
                                >
                                    All Attendees
                                </Checkbox>
                            </div>
                            <CheckboxGroup
                                options={receivers.concat(location).map(item => ({ label: item.name, value: item.mail }))}
                                value={checkedList}
                                onChange={this.onChange.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="schedule-content">
                        <div className="schedule-date">
                            <Icon type="left" className="btn" onClick={this.searchPev} />
                            <Icon type="right" className="btn" onClick={this.searchNext} />
                            {date ? date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                        </div>
                        <div className="table">
                            <div className="line thead">
                                {new Array(20).fill('').map((item, i) => {
                                    const time = i + 18;
                                    const h = parseInt(time / 2);
                                    const m = time % h * 30 === 0 ? '00' : '30';
                                    return <div className="block">{h}:{m}</div>
                                })}
                            </div>
                            {data.map((item, y) => {
                                const line = new Array(20).fill('');
                                item.forEach(block => {
                                    line.forEach((_, i) => {
                                        const time = i;
                                        if (time >= block.start && time <= block.end) {
                                            line[i] = block.status
                                        }
                                    });
                                });
                                return (<div className="line">
                                    {line.map((cell, x) => {
                                        return <div
                                            className={classnames(['block', {
                                                'active': top >= 0 && left >= 0 && x >= left && x <= right,
                                                'myself': y === 0,
                                                'start': x === left,
                                                'end': x === right,
                                                'busy': cell === 1,
                                                'out': cell === 2,
                                                'interim': cell === 3,
                                                'unkown': cell === 4,
                                                'occupy': cell === 5
                                            }])}
                                            onMouseDown={this.handleMouseDown.bind(this, x, y)}
                                            onMouseUp={this.handleMouseUp.bind(this, x, y)}
                                            onMouseOver={this.handleMouseOver.bind(this, x, y)}
                                        />
                                    })}
                                </div>);
                            })}
                        </div>
                    </div>
                </div>
                <div className="schedule-footer">
                    <div className="item">
                        <AddAttendees
                            visible={showAddAttendees}
                            onClose={() => this.setState({ showAddAttendees: false })}
                            onSelect={this.onSelectAttendee.bind(this)}
                        />
                        <Button style={{ width: 125, marginRight: 8 }} onClick={() => {
                            this.setState({
                                showAddAttendees: true
                            });
                        }}>Add Attendees</Button>
                        <div className="label" style={{ 'width': 70, 'marginRight': 10 }}>Start Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            disabledDate={disabledDate}
                            onChange={(date) => { this.handleTime('startTime',date) }}
                            value={startTime.zone(offsetUTC)}
                            className="my-date-picker"
                            style={{ 'marginRight': 10 }}
                        />
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            value={startTime.zone(offsetUTC)}
                            hideDisabledOptions={true}
                            onChange={date => { this.handleTime('startTime', date) }}
                            disabledHours={() => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={() => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                        />
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
                    </div>
                    <div className="item">
                        <AddRooms
                            visible={showAddRooms}
                            onClose={() => this.setState({ showAddRooms: false })}
                            onSelect={this.onSelectRoom.bind(this)}
                        />
                        <Button style={{ width: 125, marginRight: 8 }} onClick={() => { this.setState({ showAddRooms: true }) }}>Add Rooms</Button>
                        <div className="label" style={{ 'width': 70, 'marginRight': 10 }}>End Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            disabledDate={disabledDate}
                            onChange={(date) => { this.handleTime('endTime',date) }}
                            value={endTime.zone(offsetUTC)}
                            className="my-date-picker"
                            style={{ 'marginRight': 10 }}
                        />
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            value={endTime.zone(offsetUTC)}
                            hideDisabledOptions={true}
                            disabledHours={() => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={() => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                            onChange={(date) => { this.handleTime('endTime',date) }}
                        />
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
                    </div>
                    <div className="item">
                        <div className="status busy">Busy</div>
                        <div className="status out">Out of Office</div>
                        <div className="status interim">Tentative</div>
                        <div className="status unkown">No Information</div>
                        <div className="status occupy">Working Elsewhere</div>
                    </div>
                </div>
            </div>
        )
    }
}


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

Schedule.propTypes = {
    actions: PropTypes.object.isRequired,
    startTime: PropTypes.object.isRequired,
    endTime: PropTypes.object.isRequired,
    showTimezone: PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
