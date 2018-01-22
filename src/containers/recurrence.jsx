import React, { Component } from 'react';
import { Modal, DatePicker, Form, Table, TimePicker, Checkbox, Radio } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import moment from 'moment';
import { generateOptions } from 'lib/util';
import fetch from 'lib/fetch';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const durationOptions = new Array(12).fill('').map((item, i) => {
    return <Option key={i} value={i+1}>{(i+1)/2}小时</Option>
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
        openKeys: []
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
        })
    }
    render () {
        const { visible, list } = this.state;
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
                <div className="section">
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">Start Time:</label>
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            format="HH:mm"
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
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">End Time:</label>
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            defaultValue={moment()}
                            format="HH:mm"
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
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">Duration:</label>
                        <Select style={{width: 100}} defaultValue={1}>
                            {durationOptions}
                        </Select>
                    </div>
                </div>
                <div className="section">
                    <div className="section-title">Recurrence Pattern</div>
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
                </div>
                <div className="section">
                    <div className="section-title">Recurrence Pattern</div>
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
                </div>
                <div className="rcu-item rcu-select">
                    <Button type="primary" size="large">OK</Button>
                    <Button type="info" size="large">Cancel</Button>
                    <Button type="default" size="large">Remove Recurrence</Button>
                </div>
            </Modal>
        )
    }
}

export default Recurrence;