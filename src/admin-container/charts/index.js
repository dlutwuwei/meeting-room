import React, { Component } from 'react'
import { Table, DatePicker, Input, AutoComplete } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';
const Option = AutoComplete.Option;
const { RangePicker } = DatePicker;

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
        return moment(record.endTime*1000).format('YYYY-MM-DD HH:mm');
    }
}, {
    title: '楼层',
    dataIndex: 'roomFloor'
}, {
    title: '会议室',
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
        attendees: '',
        userList: [],
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
    load(page, params) {
        const {
            startDate = '',
            endDate='',
            roomName='',
            roomMail='',
            from='',
            floor=''
        } = this.state;
        this.setState({
            loading: true,
            data: [],
            ...params
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
        const { data, pagination, loading, userList } = this.state;
        const children = userList.map((item, i) => {
            return <Option value={item.mail} key={i}>{item.name}</Option>;
          });
        return (
            <div>
                <div className="filter-list">
                    <RangePicker onChange={([val, val1]) => {
                        this.load(1, {
                            startDate: val.format('YYYY-MM-DD'),
                            endDate: val1.format('YYYY-MM-DD')
                        });
                    }}/>
                    <AutoComplete
                        dataSource={userList}
                        style={{ width: 200 }}
                        onSelect={this.handleSelect}
                        onSearch={this.handleSearch}
                        placeholder="发起人搜索"
                        onChange={(val) => {
                            this.load(1, {
                                from: val
                            });
                        }}
                    >
                        {children}
                    </AutoComplete>
                    <Input placeholder="输入房间名称" onChange={(e) => {
                        this.load(1, {
                            roomName: e.target.value
                        });
                    }}/>
                    {/* <DatePicker placeholder="输入结束日期" onChange={(val) => {
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
                    <div></div>
                    <div></div>
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