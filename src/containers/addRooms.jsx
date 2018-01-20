import React, { Component } from 'react';
import { Modal, DatePicker, Form, Checkbox, Table, TimePicker } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import moment from 'moment';
import { generateOptions } from 'lib/util';
import fetch from 'lib/fetch';

const CheckboxGroup = Checkbox.Group;

const peopleOptions = new Array(12).fill('').map((item, i) => {
    return <Option key={i} value={i+1}>{i+1}</Option>
});
const eqOptions = ['Phone', 'Projector', 'TV', 'Whiteboard'];

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
  
class AddRooms extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        visible: false,
        list: []
    }
    search(startTime, endTime, equipment, capacity) {
        fetch.get('/api/Rooms/getList', {
            startTime,
            endTime,
            equipment,
            capacity,
            token: '40a56c3e9cc9465f60c810f2d26d38c'
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
            title="Add Rooms"
            style={{ top: 20 }}
            visible={visible}
            width={600}
            onOk={() => this.closeModal()}
            onCancel={() => this.closeModal()}
            footer={null}
            wrapClassName="add-room-container"
            >
                <div className="room-item">
                    <label htmlFor="" className="room-title">Start Time:</label>
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
                        format="HH:mm"
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
                <div className="room-item">
                    <label htmlFor="" className="room-title">End Time:</label>
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
                        format="HH:mm"
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
                <div className="room-item">
                    <label htmlFor="" className="room-title">People:</label>
                    <Select style={{width: 60}} defaultValue={1}>
                        {peopleOptions}
                    </Select>
                </div>
                <div className="room-item">
                    <label htmlFor="" className="room-title">Equipment:</label>
                    <CheckboxGroup options={eqOptions} defaultValue={['Apple']} onChange={this.onEuipmentChange} />
                </div>
                <div className="room-item">
                    <Table columns={columns} dataSource={list} />
                </div>
                <div className="room-item room-select">
                    <Button type="primary" size="large">Select</Button>
                </div>
            </Modal>
        )
    }
}

export default AddRooms;