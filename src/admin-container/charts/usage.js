import React, { Component } from 'react'
import { Table, DatePicker, Input, Select } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;

const columns = [{
    title: '会议室名称',
    dataIndex: 'roomName'
}, {
    title: '区域',
    dataIndex: 'areaName',
}, {
    title: '总预订次数',
    dataIndex: 'meetingTimes'
},  {
    title: '总预订时长(分钟)',
    dataIndex: 'meetingTimeLength'
}, {
    title: '楼层',
    dataIndex: 'floor'
}, {
    title: '使用率',
    key: 'usedRate',
    render: (text, record) => {
        return record.usedRate + '%'
    }
}];

import './charts.less';
const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
const today = new moment();
class Usage extends Component {
    state = {
        loading: false,
        data: [],
        attendees: '',
        userList: [],
        startDate: today.clone().subtract(1, 'months').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
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
        fetch.get('/api/report/getRoomUseRateList', {
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
                    <div><a target="_blank" className="download-link" href={ `/api/report/exportRoomUseRateList?token=${localStorage.getItem('__meeting_token')}&startDate=${startDate}&endDate=${endDate}&areaId=${areaId}&floor=${floor}&roomName=${roomName}`}>下载报表</a></div>
                    <div />
                </div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default Usage;
