import React, { Component } from 'react';
import { DatePicker } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import TimePicker from 'rc-time-picker';

import moment from 'moment';

import '../style/appointment.less';
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;

class Appointment extends Component {
    render () {
        return (
            <div className="appointment-container">
                <div className="appoint-left">
                    <div className="send-btn">Send</div>
                </div>
                <div className="appoint-main">
                    <div className="item">
                        <Select defaultValue="1" style={{ width: 85, marginRight: 8 }}>
                            <Option value="1">From</Option>
                        </Select>
                        <Input placeholder="wuwei@meeting.com" disabled/>
                    </div>
                    <div className="item">
                        <Button style={{ width: 85, marginRight: 8 }}>To...</Button>
                        <Input placeholder="Basic usage" />
                    </div>
                    <div className="item">
                        <div className="label">Subject</div><Input placeholder="Basic usage" />
                    </div>
                    <div className="item">
                        <div className="label">Location</div><Input placeholder="Basic usage" /><div className="rooms" />
                    </div>
                    <div className="item">
                        <div className="label">Start Time</div>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
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
                        />
                    </div>
                    <div className="item">
                        <div className="label">End Time</div>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
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
                        />
                    </div>
                    <div className="item">
                        <TextArea placeholder="Autosize height with minimum and maximum number of lines" autosize={{ minRows: 6}} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Appointment