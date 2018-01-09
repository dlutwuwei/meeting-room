import React, { Component } from 'react'
import Select from 'components/select';
import Button from 'components/button';

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
    onChange() {

    }
    render () {
        return (
            <div className="schedule-contianer">
                <div className="schedule-main">
                    <div className="schedule-left">
                        <div className="send-btn2">Send</div>
                        <div className="attendees">
                            <CheckboxGroup options={options} defaultValue={['Pear']} onChange={this.onChange} />
                        </div>
                    </div>
                    <div className="schedule-content">
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