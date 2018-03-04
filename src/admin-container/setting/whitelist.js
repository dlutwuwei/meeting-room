import React, { Component, Fragment} from 'react';
import { Breadcrumb, Icon, Divider} from 'antd';
import fetch from 'lib/fetch';
import List from '../list';

const columns = [
    {
        title: '用户',
        dataIndex: 'mail',
    },
    {
        title: '部门',
        dataIndex: 'departmentName',
    },
    {
        title: '区域',
        dataIndex: 'area',
    },
    {
        title: '操作',
        render: () => (
            <Fragment>
                <a href=""><Icon type="form" /></a>
                <Divider type="vertical" />
                <a href=""><Icon type="delete" /></a>
            </Fragment>
        ),
    },
];

class BlackList extends Component {
    state = {
        data: [],
        selectedRows: [],
        loading: false,
        modalVisible: false
    }
    fetchData = () => {
        fetch.get('/api/whiteList/getList', {
            token: localStorage.getItem('__meeting_token')
        }).then(res => {
            this.setState({
                data: res.data.list,
                page: res.data.page,
                pageSize: res.data.pageSize
            });
        }).catch(() => {
            this.setState({
                data: []
            })
        });
    }
    render () {
        const { data, loading, page, pageSize } = this.state;

        return (
            <div>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                    <Breadcrumb.Item>白名单</Breadcrumb.Item>
                </Breadcrumb>
                <List
                    getColumns={() => columns}
                    data={data}
                    loading={loading}
                    fetchData={this.fetchData}
                    page={page}
                    pageSize={pageSize}
                    showAdd={false}
                />
            </div>
        )
    }
}

export default BlackList