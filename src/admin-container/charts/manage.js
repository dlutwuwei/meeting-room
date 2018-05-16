import React, { Component } from 'react'
import { Table, DatePicker, Input, Select, Modal, message } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;


import './charts.less';
const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
const today = new moment();
const statusMap = ['未知', '预定中', '进行中', '已取消', '已结束'];

class Usage extends Component {
    state = {
        loading: false,
        data: [],
        attendees: '',
        userList: [],
        startDate: today.clone().subtract(1, 'months').format('YYYY-MM-DD'),
        endDate: today.clone().add(1, 'days').format('YYYY-MM-DD'),
        roomName: '',
        roomMail: '',
        from: '',
        floor: '',
        areaId: areas[0].id,
        pagination:{
            position: 'bottom',
            pageSize: 10,
            total: 10,
            current: 1,
            onChange: (page) => {
                this.load(page, {})
            }
        }
    }
    componentDidMount () {
        this.load(1, {});
    }
    columns = [{
        title: '会议主题',
        dataIndex: 'subject'
    }, {
        title: '预订人',
        dataIndex: 'userName',
    }, {
        title: '房间',
        dataIndex: 'roomNames'
    }, {
        title: '楼层',
        dataIndex: 'roomFloor'
    }, {
        title: '状态',
        dataIndex: 'state',
        render: (text, record) => {
            return record.isComplained ? '已投诉' : statusMap[record.state];
        }
    }, {
        title: '投诉时间',
        dataIndex: 'complainTime'
    }, {
        title: '操作',
        key: 'option',
        render: (text, record) => {
            return !record.isComplained ? (<div>
                { record.state === 2 && <a onClick={() => this.handleComplain(record.id)} style={{marginRight: 5}}>投诉会议</a>}
                { (record.state === 2 || record.state === 1) && <a onClick={() => this.handleCancel(record.id)}>取消会议</a>}
            </div>) : null;
        }
    }]
    handleComplain = (id) => {
        const data = {
            id
        };
        confirm({
            title: '投诉确认',
            content: '投诉不可取消，您确认投诉？',
            onOk: () => {
                fetch.post(`/api/meetingManage/complain?token=${localStorage.getItem('__meeting_token') || ''}`, data).then(() => {
                    message.success('投诉成功');
                    localStorage.setItem('__meeting_recurrenceJson', '');
                }).catch(() => {
                    message.error('投诉失败');
                });
            },
            onCancel: () => {
            }
        });
    }
    handleCancel = (id) => {
        const data = {
            id
        }
        confirm({
            title: '取消会议',
            content: '强制取消会议',
            onOk: () => {
                fetch.post(`/api/meetingManage/cancel?token=${localStorage.getItem('__meeting_token') || ''}`, data).then(() => {
                    message.success('取消成功');
                    localStorage.setItem('__meeting_recurrenceJson', '');
                }).catch(() => {
                    message.error('取消失败');
                });
            },
            onCancel: () => {
            }
        });
    }
    load(page, params) {
        let {
            startDate,
            endDate,
            roomName='',
            areaId,
            floor
        } = this.state;
        this.setState({
            loading: true,
            data: [],
            ...params
        });
        fetch.get('/api/meetingManage/getMeetingList', {
            token: localStorage.getItem('__meeting_token'),
            page: page,
            pageSize: 10,
            startDate,
            endDate,
            roomName,
            floor,
            areaId,
            ...params
        }).then(r => {
            this.setState({
                loading: true
            });
            const { page, pageSize, totalPage } = r.data;
            this.setState({
                loading: false,
                data: r.data.list,
                pagination: {
                    pageSize,
                    current: page,
                    total: totalPage * pageSize
                }
            });

        }).catch(() => {
            // Modal.error({
            //     content: e.message || e
            // });
            // clearInterval(this.timer);
            this.setState({
                loading: false
            });
        })
    }
    handleSelect = (val) => {
        this.setState({
            attendees: val
        });
        this.load(1, {
            from: val,
        });
    }
    handleSearch = (value) => {
        this.setState({
            fetching: true
        });
        fetch.get('/api/meeting/getAttenders', {
            keyword: value,
            token: localStorage.getItem('__meeting_token') || ''
        }).then((r) => {
            this.setState({
                userList: r.data.list.map(item => ({
                    name: item.userName,
                    mail: item.mail
                })),
                fetching: false
            });
        });
    }
    render() {
        const {
            startDate,
            endDate,
            roomName='',
            areaId,
            floor,
            data, pagination, loading
        } = this.state;
        const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
        return (
            <div>
                <div className="filter-list">
                    <RangePicker defaultValue={[today.clone().subtract(1, 'months'), today]} onChange={([val, val1]) => {
                        this.load(1, {
                            startDate: val.format('YYYY-MM-DD'),
                            endDate: val1.clone().add(1, 'days').format('YYYY-MM-DD')
                        });
                    }} placeholder={['开始时间', '结束时间']}/>
                    <Select
                        style={{ width: 120 }}
                        placeholder="请输入区域"
                        defaultValue={areas[0].id}
                        onChange={(val) => {
                            this.load(1, {
                                areaId: val
                            });
                        }}
                    >
                        { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                    </Select>
                    <Input placeholder="输入会议室名称" onChange={(e) => {
                        this.load(1, {
                            roomName: e.target.value
                        });
                    }}/>
                    {/* <DatePicker placeholder="输入结束日期" defaultValue={today} onChange={(val) => {
                        this.load(1, {
                            endDate: val.format('YYYY-MM-DD')
                        });
                    }}/> */}
                </div>
                <div className="filter-list">
                    <Input placeholder="输入楼层" onChange={(e) => {
                        this.load(1, {
                            floor: e.target.value
                        });
                    }}/>
                    <div />
                    <div />
                </div>
                <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={data}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default Usage;
