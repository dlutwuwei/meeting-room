import React, { Component } from 'react'
import { Table, DatePicker, Input } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';

const statusMap = ['未知', '预定中', '进行中', '已取消', '已结束'];

const columns = [{
    title: '主题',
    dataIndex: 'subject'
}, {
    title: '开始时间',
    dataIndex: 'startTime',
    render: (text, record) => {
        return moment(record.startTime*1000).format('YYYY-MM-DD HH:mm');
    }
},  {
    title: '结束时间',
    dataIndex: 'endTime',
    render: (text, record) => {
        return moment(record.startTime*1000).format('YYYY-MM-DD HH:mm');
    }
}, {
    title: '楼层',
    dataIndex: 'roomFloor'
}, {
    title: '房间',
    dataIndex: 'roomNames'
}, {
    title: '发起人',
    dataIndex: 'userName'
}, {
    title: '状态',
    key: 'state',
    render: (text, record) => {
        return statusMap[record.state]
    },
}];
import './charts.less';

class Charts extends Component {
    state = {
        loading: false,
        data: [],
        startDate: '',
        endDate: '',
        roomName: '',
        roomMail: '',
        from: '',
        floor: '',
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
    load(page, {
        startDate = '',
        endDate='',
        roomName='',
        roomMail='',
        from='',
        floor=''
    }) {
        this.setState({
            loading: true,
            data: []
        });
        fetch.get('/api/report/getMeetingList', {
            token: localStorage.getItem('__meeting_token'),
            page: page,
            pageSize: 10,
            startDate,
            endDate,
            roomName,
            roomMail,
            from,
            floor,
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
    render() {
        const { data, pagination, loading } = this.state;
        return (
            <div>
                <div className="filter-list">
                    <DatePicker placeholder="输入开始日期" onChange={(val) => {
                        this.load(1, {
                            startDate: val.format('YYYY-MM-DD'),
                        });
                    }}/>
                    <DatePicker placeholder="输入结束日期" onChange={(val) => {
                        this.load(1, {
                            endDate: val.format('YYYY-MM-DD')
                        });
                    }}/>
                    <Input placeholder="输入房间名称" onChange={(e) => {
                        this.load(1, {
                            roomName: e.target.value
                        });
                    }}/>
                    <Input placeholder="输入楼层" onChange={(e) => {
                        this.load(1, {
                            floor: e.target.value
                        });
                    }}/>
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

export default Charts