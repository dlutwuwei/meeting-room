import React, { Component } from 'react'
import { Table, DatePicker, Input, AutoComplete } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';
const Option = AutoComplete.Option;


const columns = [{
    title: '会议室名称',
    dataIndex: 'roomName'
}, {
    title: '英文名称',
    dataIndex: 'enName'
}, {
    title: '总预订次数',
    dataIndex: 'meetingTimes'
},  {
    title: '总预订时长',
    dataIndex: 'meetingTimeLength'
}, {
    title: '楼层',
    dataIndex: 'roomFloor'
}, {
    title: '发起人',
    dataIndex: 'userName'
}, {
    title: '使用率',
    key: 'usedRate'
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
            areaId,
            areaName,
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
            areaId,
            areaName,
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
                </div>
                <div className="filter-list">
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