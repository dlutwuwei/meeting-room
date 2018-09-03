import React, { Component } from 'react'
import { Table } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';

class CompliantList extends Component {
    state = {
        loading: false,
        data: []
    }
    componentDidMount() {
        this.load();
    }
    columns = [{
        title: __('会议主题'),
        dataIndex: 'subject'
    }, {
        title: __('会议室'),
        dataIndex: 'roomNames',
    }, {
        title: __('楼层'),
        dataIndex: 'roomFloor'
    }, {
        title: __('开始时间'),
        dataIndex: 'startTime',
        render: (text) => {
            return moment(text*1000).format('YYYY-MM-DD HH:mm')
        }
    }, {
        title: __('结束时间'),
        dataIndex: 'endTime',
        render: (text) => {
            return moment(text*1000).format('YYYY-MM-DD HH:mm')
        }
    }]
    load() {
        this.setState({
            loading: true
        });
        fetch.get('/api/meetingManage/getComplainList', {
            token: localStorage.getItem('__meeting_token'),
            userId: this.props.userId
        }).then(r => {
            this.setState({
                data: r.data,
                loading: false
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
        })
    }
    render () {
        const { loading, data } = this.state;
        return (
            <div>
                <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={data}
                    pagination={false}
                />
            </div>
        )
    }
}

export default CompliantList