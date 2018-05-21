import React, { Component } from 'react';
import { Modal, Checkbox, Table, Icon, Button, Input, DatePicker, Spin } from 'antd';
import moment from 'moment';
import fetch from 'lib/fetch';
import ScheduleTable from 'components/shedule-table';

const CheckboxGroup = Checkbox.Group;


const eqOptions = ['Phone', 'Projector', 'TV', 'Whiteboard'];

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
}

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
        pagination: {

        },
        loading: false,
        eqGroup: [],
        showShedule: false
    }
    postData = {
        area: 'SH',
        // startTime: moment().format('YYYY-MM-DD HH:mm'),
        // endTime: moment().format('YYYY-MM-DD HH:mm')
    }
    search() {
        fetch.get('/api/meeting/getRooms', {
            token: localStorage.getItem('__meeting_token') || '',
            capacity: this.props.defaultCapacity
        }).then(r => {
            this.setState({
                list: r.data.list,
                pagination: {
                    total: r.data.totalPage * r.data.pageSize,
                    pageSize: r.data.pageSize,
                    current: r.data.page
                }
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
            title: 'Floor',
            dataIndex: 'floor',
            key: 'floor',
        },
        {
            title: 'Phone',
            dataIndex: 'hasPhone',
            key: 'phone',
            render: (val) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'TV',
            dataIndex: 'hasTV',
            key: 'tv',
            render: (val) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Whiteboard',
            dataIndex: 'hasWhiteBoard',
            key: 'whiteboard',
            render: (val) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Projector',
            dataIndex: 'hasProjector',
            key: 'projector',
            render: (val) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (val) => {
                return val && <Icon type="check" />
            }
        }, {
            title: 'Action',
            key: 'action',
            render: (val, record) => {
                const onlyone = this.props.onlyone;
                return (<span>
                    <Checkbox
                        checked={!!record.selected}
                        onChange={(e) => {
                            this.state.list.forEach(item => {
                                if(item.id == record.id) {
                                    item.selected = e.target.checked;
                                } else if(onlyone){
                                    item.selected = false;
                                }
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
    handelPagination = (pagination) => {
        this.handleChange('', '', pagination.current, pagination.pageSize)
    }
    handleChange(type, value, page = 1, pageSize = 10) {
        if (type === 'startDate' || type === 'endDate') {
            type = type.replace('Date', 'Time');
        }
        // startDate和startTime合并
        // 后端存储utc时间
        const nowDate = moment.utc().format('YYYY-MM-DD');
        if( type === 'startTime') {
            value = moment(this.postData['startTime'] || nowDate).utc().format('YYYY-MM-DD HH:mm');
        }
        if (type === 'endTime') {
            value = moment(this.postData['endTime'] || nowDate).utc().format('YYYY-MM-DD HH:mm');
        }
        this.postData[type] = value;
        this.setState({
            loading: true,
            list: []
        });
        fetch.get('/api/meeting/getRooms', {
            ...this.postData,
            page,
            pageSize,
            token: localStorage.getItem('__meeting_token') || ''
        }).then(r => {
            this.setState({
                list: r.data.list,
                loading: false,
                pagination: {
                    total: r.data.totalPage * r.data.pageSize,
                    pageSize: r.data.pageSize,
                    current: r.data.page
                }
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
        });
    }
    onEuipmentChange(value) {
        this.postData['equipment'] = value.map(val => equipment[val]).join(',');
        this.setState({
            loading: true,
            list: []
        });
        fetch.get('/api/meeting/getRooms', {
            ...this.postData,
            token: localStorage.getItem('__meeting_token') || ''
        }).then(r => {
            this.setState({
                list: r.data.list,
                loading: false,
                pagination: {
                    total: r.data.totalPage * r.data.pageSize,
                    pageSize: r.data.pageSize,
                    current: r.data.page
                }
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
        })
    }
    searchSchedule = (date) => {
        this.setState({
            loading: true,
        }, () => {
            const data = [];
            fetch.get('/api/schedule/getList', {
                userMails: 'wuwei@mail.com',
                roomMails: this.state.list.map(item => item.mail).join(','),
                startTime: date.clone().hours(0).minutes(0).utc().format('YYYY-MM-DD HH:mm'),
                endTime: date.clone().hours(24).minutes(0).utc().format('YYYY-MM-DD HH:mm'),
                token: localStorage.getItem('__meeting_token') || ''
            }).then(r => {
                const list = r.data;
                this.state.list.forEach((user, i) => {
                    const user_data = list.filter(t => t.mail == user.mail);
                    let user_list = [];
                    if(user_data.length) {
                        user_list = user_data.map(item => {
                            const startTime = moment(item.startTime*1000);
                            const endTime = moment(item.endTime*1000);
                            const start = startTime.hours()*2 + parseInt(startTime.minutes()/30);
                            const end = endTime.hours()*2 + parseInt(endTime.minutes()/30) - 1;
                            // console.log(item.mail, start, end, startTime, endTime);
                            return ({
                                status: item.showAs,
                                start,
                                end,
                                name: item.userName,
                                tel: item.tel,
                                subject: item.subject,
                                mail: item.mail
                            })
                        });
                    }
                    data[i] = user_list;
                });
                this.setState({
                    data,
                    loading: false
                });
                // function setDay(time, date) {
                //     const n = date.dayOfYear();
                //     return time.clone().dayOfYear(n);
                // }
                // this.props.changeProp('startTime', setDay(this.props.startTime, date))
                // this.props.changeProp('endTime', setDay(this.props.endTime, date))
            }).catch(() => {
                this.setState({
                    loading: false
                });
            });
        });
        
    }
    render() {
        const { visible, list, showShedule, loading } = this.state;
        const { startTime } = this.props;
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
                    <label htmlFor="" className="room-title">Attendees:</label>
                    <Input
                        style={{ width: 60 }}
                        defaultValue={this.props.defaultCapacity}
                        onChange={(e) => { this.handleChange('capacity', e.target.value)}}
                    >
                    </Input>
                </div>
                <div className="room-item">
                    <label htmlFor="" className="room-title">Floor:</label>
                    <Input
                        style={{ width: 60 }}
                        defaultValue={''}
                        onChange={(e) => this.handleChange('floor', e.target.value)}
                    />
                </div>
                <div className="room-item">
                    <label htmlFor="" className="room-title">Equipment:</label>
                    <CheckboxGroup options={eqOptions} defaultValue={[]} onChange={this.onEuipmentChange.bind(this)} />
                </div>
                <div><a onClick={() => {
                    this.setState({
                        showShedule: !this.state.showShedule
                    });
                    this.searchSchedule(this.props.startTime);
                }}>{showShedule ? 'Show Room List' : 'Show Room Schedule'}</a></div>
                <div className="room-item">
                    { !showShedule && <Table
                        bordered
                        columns={this.getClomuns()}
                        dataSource={list}
                        loading={loading}
                        style={{width: 760, marginTop: 20}}
                        pagination={this.state.pagination}
                        onChange={this.handelPagination}
                    />}
                    { !!showShedule && <div style={{ width: '100%',  padding: '10px', marginLeft: -30 }}>
                        <DatePicker
                            defaultValue={startTime}
                            onChange={(val) => {
                                this.searchSchedule(val);
                            }}
                            disabledDate={disabledDate}
                            style={{ marginLeft: 30 }}
                        />
                        <ScheduleTable loading={loading} users={this.state.list} data={this.state.data}/> 
                    </div>}
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

AddRooms.defaultProps = {
    onlyone: true,
    defaultCapacity: 1
}

export default AddRooms;