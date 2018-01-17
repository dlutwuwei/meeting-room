import React, { Component } from 'react';
import { DatePicker, Form } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import AddRooms from './addRooms';

import '../style/appointment.less';
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 3
    },
    wrapperCol: {
        span: 21
    }
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
        showAddRooms: false
    }
    openRooms() {
        this.setState({
            showAddRooms: true
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { showAddRooms } = this.state;
        return (
            <div className="appointment-container">
                <div className="appoint-left">
                    <div className="send-btn">Send</div>
                </div>
                <div className="appoint-main">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            label={<Select defaultValue="1" style={{ width: 85 }}>
                                <Option value="1">From</Option>
                            </Select>}
                            {...formItemLayout}
                        >
                            <Input placeholder="wuwei@meeting.com" disabled/>
                        </FormItem>
                        <FormItem
                            label={<Button style={{ width: 85 }}>To...</Button>}
                            {...formItemLayout}
                        >
                            <Input />
                        </FormItem>
                        <FormItem
                            label="Subject"
                            {...formItemLayout}
                        >
                            <Input placeholder="Basic usage" />
                        </FormItem>
                        <FormItem
                            label="Location"
                            {...formItemLayout}
                        >
                            <div className="item">
                                <AddRooms visible={showAddRooms}/>
                                <Input placeholder="Basic usage" style={{ width: 309 }}/><div className="rooms" onClick={this.openRooms.bind(this)}/>
                            </div>
                        </FormItem>
                        <FormItem
                            label="Start Time"
                            {...formItemLayout}
                        >
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
                        </FormItem>
                        <FormItem
                            label="End Time"
                            {...formItemLayout}
                        >
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
                        </FormItem>
                        <div className="item">
                            <TextArea placeholder="Autosize height with minimum and maximum number of lines" autosize={{ minRows: 6}} />
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const WrappedDynamicRule = Form.create()(Appointment);

export default WrappedDynamicRule