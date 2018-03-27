import React, { Component } from 'react'
import { Table } from 'antd';
import fetch from 'lib/fetch';
const statusMap = ['未知', '预定中', '进行中', '已取消', '已结束'];

const columns = [{
    title: '品牌',
    dataIndex: 'brand'
}, {
    title: '主题',
    dataIndex: 'meeting'
}, {
    title: '时间',
    dataIndex: 'time'
}, {
    title: '楼层',
    dataIndex: 'floor'
}, {
    title: '房间',
    dataIndex: 'room'
}, {
    title: '发起人',
    dataIndex: 'organizer'
}, {
    title: '状态',
    key: 'state',
    render: (text, record) => {
        return statusMap[record.state]
    },
}];


class Charts extends Component {
    state = {
        loading: false,
        data: [],
        pagination:{
            position: 'bottom',
            pageSize: 10,
            total: 10,
            current: 1,
            onChange: (page) => {
                this.load(page)
            }
        }
    }
    componentDidMount () {
        this.load(1);
    }
    load(page) {
        fetch.get('/api/board/getList', {
            page: page,
            pageSize: 10,
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
        const { data, pagination } = this.state;
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default Charts