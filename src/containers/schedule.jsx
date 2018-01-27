import React, { Component } from 'react'
import Select from 'components/select';
import Button from 'components/button';
import fetch from 'lib/fetch';
import AddRooms from './addRooms';
import AddAttendees from './addAttendees';
import moment from 'moment';
import classnames from 'classNames';

import Nav from './meeting-nav';
import { Checkbox, DatePicker, Icon, message } from 'antd';
import TimePicker from 'rc-time-picker';

import '../style/schedule.less';
import addAttendees from './addAttendees';

const CheckboxGroup = Checkbox.Group;

const options = [];

function generateOptions(length, include) {
    const arr = [];
    for (let value = 0; value < length; value++) {
        if (include(value)) {
            arr.push(value);
        }
    }
    return arr;
}

class Schedule extends Component {
    constructor() {
        super();
    }
    state = {
        // 计划表
        data: [1, 2, 3],
        checkAll: false,
        checkedList: [],
        // 列表选型
        options: [],
        showAddRooms: false,
        showAddAttendees: false,
        rooms: [],
        attendees: [],
        date: moment(),
        startTime: moment(),
        endTime: moment(),
        top: -1,
        left: -1,
        right: 0,
        bottom: 0
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
    search(date, users = []) {
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
        this.setState({
            options: this.state.options.concat(options),
            checkedList: this.state.checkedList.concat(options.map(item => item.value)),
            checkAll: true,
            data: this.state.data.concat(options.map(item => ({})))
        });
    }
    onSelectRoom(rooms) {
        this.setState({
            rooms
        });
        this.addToList(rooms);
    }
    onSelectAttendee(attendees) {
        this.setState({
            attendees
        });
        this.addToList(attendees)
    };
    handleSend = () => {
        const { attendees, rooms, date, startTime, endTime } = this.state;
        const data = {};
        data.from = localStorage.getItem('__meeting_user_email') || '';
        data.receiver = attendees.map(item => item.mail).join(';');
        data.roomMails = rooms.map(item => item.mail).join(';');
        data.startTime = date.utc().format('YYYY-MM-DD') + ' ' + startTime.utc().format('HH:mm');
        data.endTime = date.utc().format('YYYY-MM-DD') + ' ' + endTime.utc().format('HH:mm');
        data.showas = localStorage.getItem('__meeting_showas') || '';
        data.reminder = localStorage.getItem('__meeting_reminder') || 15;
        data.isPrivate = localStorage.getItem('__meeting_private') || false;
        data.importance = localStorage.getItem('__meeting_private') || '';
        localStorage.setItem('__appointment_data', JSON.stringify(data));
        // fetch.post(`/api/meeting/add?token=${localStorage.getItem('__meeting_token') || ''}`, data).then(r => {
        //   message.success('预定成功');
        //   setTimeout(() => {
        //     location.href = '/home?tab=my-meeting';
        //   })
        // }).catch(err => {
        //   message.error('预定失败');
        // });
    }
    handleMouseDown = (x, y) => {
        console.log('down', x, y, `${9+parseInt(x/2)}:${(x%2)*30}`)
        this.hover = true;
        this.setState({
            left: x,
            top: y,
            right: -1,
            bottom: -1,
            startTime: moment(`${9+parseInt(x/2)}:${(x%2)*30}`, 'HH:mm')
        });
    }
    handleMouseOver = (x, y) => {
        if(this.hover) {
            this.setState({
                right: x,
                bottom: y,
                endTime: moment(`${9+parseInt((x+1)/2)}:${((x+1)%2)*30}`, 'HH:mm')
            });
            console.log('UP', x, y, `${9+parseInt((x+1)/2)}:${((x+1)%2)*30}`)

        }
    }
    handleMouseUp = (x, y) => {
        // this.setState({
        //     right: x,
        //     bottom: y,
        //     endTime: moment(`${9+parseInt(x/2)}:${((x+2)%2)*30}`, 'HH:mm')
        // });
        this.hover = false;
    }
    render () {
        const { data, checkAll, checkedList, options, date, showAddRooms,
            showAddAttendees, left, right, top, bottom,
            startTime, endTime } = this.state;
        // console.log( left, right, top, bottom)
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
                                options={options}
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
                        <table>
                            <thead>
                                <tr>
                                    {new Array(20).fill('').map((item, i) => {
                                        const time = i+18;
                                        const h = parseInt(time/2);
                                        const m = time%h*30 === 0? '00': '30';
                                        return <th>{h}:{m}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, y) => {
                                    return ( <tr>
                                        {new Array(20).fill('').map((cell, x) => {
                                            // console.log(x >= left && y >= top && y <= bottom && x <= right)
                                            return <td
                                                    className={classnames([{ 'active': top >= 0 && left >= 0 && x >= left && x <= right}])}
                                                    onMouseDown={this.handleMouseDown.bind(this, x, y)}
                                                    onMouseUp={this.handleMouseUp.bind(this, x, y)}
                                                    onMouseOver={this.handleMouseOver.bind(this, x, y)}
                                                />
                                        })}
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="schedule-footer">
                    <div className="item">
                        <AddAttendees
                            visible={showAddAttendees}
                            onClose={() => this.setState({ showAddAttendees: false})}
                            onSelect={this.onSelectAttendee.bind(this)}
                        />
                        <Button style={{ width: 125, marginRight: 8 }} onClick={() => {
                            this.setState({
                                showAddAttendees: true
                            });
                        }}>Add Attendees</Button>
                        <div className="label" style={{'width': 70, 'marginRight': 10}}>Start Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            onChange={(date) => { this.setState({ date })}}
                            value={date}
                            className="my-date-picker"
                            style={{'margin-right': 10}}
                        />
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            value={startTime}
                            hideDisabledOptions={true}
                            onChange={date => { this.setState({ startTime: date })}}
                            disabledHours={(h) => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={(m) => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                        />
                    </div>
                    <div className="item">
                        <AddRooms
                            visible={showAddRooms}
                            onClose={() => this.setState({ showAddRooms: false})}
                            onSelect={this.onSelectRoom.bind(this)}
                        />
                        <Button style={{ width: 125, marginRight: 8 }} onClick={() => { this.setState({showAddRooms: true})}}>Add Rooms</Button>
                        <div className="label" style={{'width': 70, 'marginRight': 10}}>End Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            onChange={(date) => { date && this.setState({ date })}}
                            value={date}
                            className="my-date-picker"
                            style={{'margin-right': 10}}
                        />
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            value={endTime}
                            hideDisabledOptions={true}
                            disabledHours={(h) => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={(m) => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                            onChange={date => { this.setState({ endTime: date })}}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Schedule