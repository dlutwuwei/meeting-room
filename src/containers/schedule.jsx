import React, { Component } from 'react'
import Select from 'components/select';
import Button from 'components/button';
import fetch from 'lib/fetch';

import moment from 'moment';

import Nav from './meeting-nav';
import { Checkbox, DatePicker, Icon} from 'antd';
import TimePicker from 'rc-time-picker';

import '../style/schedule.less';

const CheckboxGroup = Checkbox.Group;

const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
];

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
        data: [],
        checkAll: false,
        checkedList: [],
        options: [],
        date: new Date().toLocaleDateString()
    }
    componentDidMount() {
        this.search(new Date().toLocaleDateString(), [])
    }
    search(date, users) {
        fetch.get('/api/Schedule/getList', {
            users: JSON.stringify(users),
            date: date,
            token: '40a56c3e9cc9465f60c810f2d26d38c'
        }).then(r => {
            const options = r.data.map(item => {
                return {
                    value: item.id,
                    label: item.userName
                }
            });
            r.data.forEach(item => item.selected = true)
            const checkedList = r.data.map(item => item.id);
            this.setState({
                data: r.data,
                options,
                checkedList,
                checkAll: true
            })
        });
    }
    onChange(checkedList) {
        this.state.data.forEach(item => {
            item.selected = checkedList.includes(item.id);
        });
        this.setState({
            checkedList,
            checkAll: checkedList.length === this.state.options.length,
        });
    }
    onCheckAllChange(e) {
        const allOptions = this.state.options.map(item => item.value);
        this.state.data.forEach(item => {
            item.selected = e.target.checked;
        });
        this.setState({
            checkedList: e.target.checked ? allOptions : [],
            checkAll: e.target.checked,
        });
    }
    render () {
        const { data, checkAll, checkedList, options, date } = this.state;
        return (
            <div className="schedule-contianer">
                <div className="schedule-main">
                    <div className="schedule-left">
                        <div className="send-btn2">Send</div>
                        <div className="attendees">
                            <div style={{ borderBottom: '1px solid #E9E9E9', height: 33 }}>
                                <Checkbox
                                    onChange={this.onCheckAllChange.bind(this)}
                                    checked={this.state.checkAll}
                                >
                                    All Attendees
                                </Checkbox>
                            </div>
                            <CheckboxGroup options={options} value={checkedList} onChange={this.onChange.bind(this)} />
                        </div>
                    </div>
                    <div className="schedule-content">
                        <div className="schedule-date"><Icon type="left" className="btn" /><Icon type="right" className="btn" />{date}</div>
                        <table>
                            <thead>
                                <tr>
                                    {new Array(30).fill('').map((item, i) => {
                                        const time = i+14;
                                        const h = parseInt(time/2);
                                        const m = time%h*30 === 0? '00': '30';
                                        return <th>{h}:{m}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(item => {
                                    if(!item.selected) {
                                        return <tr>  </tr>
                                    }
                                    return ( <tr>
                                        {new Array(30).fill('').map((cell, i) => {
                                            return <td>{item.userName}</td>
                                        })}
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="schedule-footer">
                    <div className="item">
                        <Button style={{ width: 105, marginRight: 8 }}>Attendees</Button>
                        <div className="label" style={{'margin-right': 10}}>Start Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            onChange={() => {}}
                            onOk={() => {}}
                            className="my-date-picker"
                            style={{'margin-right': 10}}
                        />
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            defaultValue={moment()}
                            hideDisabledOptions={true}
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
                        <div className="label" style={{'margin-right': 10}}>End Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            onChange={() => {}}
                            onOk={() => {}}
                            className="my-date-picker"
                            style={{'margin-right': 10}}
                        />
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            defaultValue={moment()}
                            hideDisabledOptions={true}
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
                </div>
            </div>
        )
    }
}

export default Schedule