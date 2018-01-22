import React, { Component } from 'react';
import { Modal, DatePicker, Form, Checkbox, Table, TimePicker, Icon, Button } from 'antd';
import Select from 'components/select';
import Input from 'components/input';
import moment from 'moment';
import { generateOptions } from 'lib/util';
import fetch from 'lib/fetch';

const CheckboxGroup = Checkbox.Group;

const peopleOptions = new Array(12).fill('').map((item, i) => {
    return <Option key={i} value={i + 1}>{i + 1}</Option>
});

const eqOptions = ['Phone', 'Projector', 'TV', 'Whiteboard'];

const equipment = {
    'Phone': 1,
    'Projector': 2,
    'TV': 3,
    'Whiteboard': 4
};

class AddRooms extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        visible: false,
        list: [],
        eqGroup: []
    }
    postData = {
        area: 'SH',
    }
    search() {
        fetch.get('/api/MeetingRoom/GetList', {
            token: localStorage.getItem('__meeting_token') || ''
        }).then(r => {
            this.setState({
                list: r.data.list
            });
        });
    }
    getClomuns(){
        return [{
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
            render: (val, record) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'TV',
            dataIndex: 'hasTv',
            key: 'tv',
            render: (val, record) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Whiteboard',
            dataIndex: 'hasWhiteboard',
            key: 'whiteboard',
            render: (val, record) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Projector',
            dataIndex: 'hasProjector',
            key: 'projector',
            render: (val, record) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (val, record) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Action',
            key: 'action',
            render: (val, record) => {
                return (<span>
                    <Checkbox
                        checked={!!record.selected}
                        onChange={(e) => {
                            this.state.list.forEach(item => {
                                if(item.id == record.id) {
                                    item.selected = e.target.checked;
                                }
                                //  else {
                                //     item.selected = false;
                                // }
                            });
                            this.setState({
                                list: this.state.list.slice()
                            });
                        }}
                    />
                </span>);
            }
        }];
        
    }
    componentDidMount() {
        this.search();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }
    closeModal = () => {
        this.setState({
            visible: false
        });
        this.props.onClose();
    }
    handleSelect = () => {
        const rooms = this.state.list.filter(item => !!item.selected);
        this.props.onSelect(rooms);
        this.closeModal();
    }
    handleChange(type, value) {
        if (type === 'startTime' || type === 'endTime') {
            value = value.format('YYYY-MM-DD HH:mm')
        }
        this.postData[type] = value;
        fetch.get('/api/MeetingRoom/GetList', {
            ...this.postData,
            token: localStorage.getItem('__meeting_token') || ''
        }).then(r => {
            this.setState({
                list: r.data
            });
        });
    }
    onEuipmentChange(value) {
        this.postData['equipment'] = value.map(val => equipment[val]);
        fetch.get('/api/meetingRoom/getList', {
            ...this.postData,
            token: localStorage.getItem('__meeting_token') || ''
        }).then(r => {
            this.setState({
                list: r.data
            });
        })
    }
    render() {
        const { visible, list, eqGroup } = this.state;
        return (
            <Modal
                title="Add Rooms"
                style={{ top: 20 }}
                visible={visible}
                width={810}
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
                        defaultValue={moment()}
                        onChange={this.handleChange.bind(this, 'startTime')}
                        className="my-date-picker"
                    />
                    <TimePicker
                        prefixCls="ant-time-picker"
                        placeholder="Select Time"
                        showSecond={false}
                        format="HH:mm"
                        defaultValue={moment()}
                        hideDisabledOptions={true}
                        onChange={this.handleChange.bind(this, 'startTime')}
                        disabledHours={(h) => {
                            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                        }}
                    />
                </div>
                <div className="room-item">
                    <label htmlFor="" className="room-title">End Time:</label>
                    <DatePicker
                        format="YYYY-MM-DD"
                        placeholder="Select Date"
                        defaultValue={moment()}
                        onChange={this.handleChange.bind(this, 'endTime')}
                        className="my-date-picker"
                    />
                    <TimePicker
                        prefixCls="ant-time-picker"
                        placeholder="Select Time"
                        showSecond={false}
                        format="HH:mm"
                        onChange={this.handleChange.bind(this, 'endTime')}
                        defaultValue={moment()}
                        hideDisabledOptions={true}
                        disabledHours={(h) => {
                            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                        }}
                    />
                </div>
                <div className="room-item">
                    <label htmlFor="" className="room-title">People:</label>
                    <Select
                        style={{ width: 60 }}
                        defaultValue={1}
                        onChange={this.handleChange.bind(this, 'capacity')}
                    >
                        {peopleOptions}
                    </Select>
                </div>
                <div className="room-item">
                    <label htmlFor="" className="room-title">Equipment:</label>
                    <CheckboxGroup options={eqOptions} defaultValue={[]} onChange={this.onEuipmentChange.bind(this)} />
                </div>
                <div className="room-item">
                    <Table bordered columns={this.getClomuns()} dataSource={list} style={{width: 760, marginTop: 20}}/>
                </div>
                <div className="room-item room-select">
                    <Button
                        type="primary"
                        size="large"
                        style={{width: 128}}
                        disabled={this.state.list.filter(item => !!item.selected).length == 0}
                        onClick={this.handleSelect}>Select
                    </Button>
                </div>
            </Modal>
        )
    }
}

export default AddRooms;