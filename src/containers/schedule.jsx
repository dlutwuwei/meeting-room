import React, { Component } from 'react'
import Select from 'components/select';
import Button from 'components/button';
import fetch from 'lib/fetch';

import moment from 'moment';

import Nav from './meeting-nav';
import { Checkbox, DatePicker} from 'antd';
import TimePicker from 'rc-time-picker';

import '../style/schedule.less';

const CheckboxGroup = Checkbox.Group;

const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
];

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
        const users = []
        fetch.get('/api/Schedule/getList', {
            users,
            pageSize: 15,
            token: '40a56c3e9cc9465f60c810f2d26d38c'
        }).then(r => {
            debugger
            const options = r.data.map(item => {
                return {
                    value: item.id,
                    label: item.userName
                }
            });
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
    render () {
        const { data, checkAll, checkedList, options, date } = this.state;
        return (
            <div className="schedule-contianer">
                <div className="schedule-main">
                    <div className="schedule-left">
                        <div className="send-btn2">Send</div>
                        <div className="attendees">
                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                            <Checkbox
                                onChange={this.onCheckAllChange.bind(this)}
                                checked={this.state.checkAll}
                            >
                                All Attendees
                            </Checkbox>
                            </div>
                            <br />
                            <CheckboxGroup options={options} value={checkedList} onChange={this.onChange.bind(this)} />
                        </div>
                    </div>
                    <div className="schedule-content">
                        <div className="schedule-date">{date}</div>
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
                                    return ( <tr>
                                        {new Array(30).fill('').map((item, i) => {
                                            return <td>空</td>
                                        })}
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="schedule-footer">
                    <div className="item">
                        <Button style={{ width: 85, marginRight: 8 }}>Attendees</Button>
                        <div className="label">Start Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            onChange={() => {}}
                            onOk={() => {}}
                            className="my-date-picker"
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
                        <div className="label">End Time</div>
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select Date"
                            onChange={() => {}}
                            onOk={() => {}}
                            className="my-date-picker"
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