import React, { Component } from 'react'
import { Table, Input, Select, AutoComplete, Modal } from 'antd';
import fetch from 'lib/fetch';
import _ from 'lodash';

const Option = Select.Option;

import './charts.less';
const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');

class Complaint extends Component {
    state = {
        loading: false,
        data: [],
        attendees: '',
        userList: [],
        userName: '',
        mail: '',
        times: '',
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
        title: __('被投诉人'),
        dataIndex: 'userName'
    }, {
        title: __('邮箱'),
        dataIndex: 'mail',
    }, {
        title: __('被投诉次数'),
        dataIndex: 'count'
    }, {
        title: __('操作'),
        dataIndex: 'endTime',
        render: (text, record) => {
            return <a onClick={this.handleView.bind(null, record.userId, record.userName)}>{__('查看')}</a>;
        }
    }]
    handleView = (userId, userName) => {
        Modal.info({
            title: <span>{__('被投诉人')}:{userName}</span>,
            content: <Table />
        });
    }
    load(page, params) {
        let {
            areaId,
            times
        } = this.state;
        this.setState({
            loading: true,
            data: [],
            ...params
        });
        fetch.get('/api/meetingManage/getComplainStatistic', {
            token: localStorage.getItem('__meeting_token'),
            page: page,
            pageSize: 10,
            areaId,
            times,
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
        fetch.get('/api/user/getList', {
            keyword: value || '',
            token: localStorage.getItem('__meeting_token') || ''
        }).then((r) => {
            r.data.list.unshift({
                userName: '不限',
                mail: 'all',
                userId: 'undefined'
            });
            this.setState({
                userList: r.data.list.map(item => ({
                    name: item.userName,
                    mail: item.mail,
                    id: item.userId
                })),
                fetching: false
            });
        });
    }
    render() {
        const {
            // startDate,
            // endDate,
            // roomName='',
            // areaId,
            // floor,
            data, pagination, loading, userList
        } = this.state;
        const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
        const children = userList.map((item, i) => {
            return <Option value={'' + item.id} key={i}>{item.name}</Option>;
        });
        return (
            <div>
                <div className="filter-list">
                    <Select
                        style={{ width: 120 }}
                        placeholder={__("请输入区域")}
                        defaultValue={areas[0].id}
                        onChange={(val) => {
                            this.load(1, {
                                areaId: val
                            });
                        }}
                    >
                        { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                    </Select>
                    {/* <Input placeholder={__("输入邮箱")} onChange={_.debounce(function(e) {
                        this.load(1, {
                          mail: e.target.value
                        });
                      }, 200)}/> */}
                    <Input placeholder={__("投诉次数")} onChange={(e) => {
                        this.load(1, {
                            times: e.target.value
                        });
                    }}/>
                    <AutoComplete
                        dataSource={userList}
                        style={{ width: 200 }}
                        onSelect={(val) => {
                            this.load(1, {
                                userId: val.key
                            });
                        }}
                        onFocus={_.debounce(this.handleSearch, 200)}
                        onSearch={_.debounce(this.handleSearch, 800)}
                        placeholder={__('选择投诉人')}
                        labelInValue
                    >
                        {children}
                    </AutoComplete>
                </div>
                <div className="filter-list">
                    
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

export default Complaint;
