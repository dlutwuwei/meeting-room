import React, { Component, Fragment } from 'react';
import { Breadcrumb, Icon, Divider, Modal } from 'antd';
import fetch from 'lib/fetch';
import List from '../list';
const confirm = Modal.confirm;

const removeCurrent = (delCurrent = () => {}) => {
    confirm({
        title: '确定删除?',
        content: '删除后无法恢复',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            delCurrent();
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

const onDeleteClick = (index, id) => {
    removeCurrent(() => {
        debugger
        fetch.post(`/api/blackList/delete?token=${localStorage.getItem('__meeting_token')}`, {
            id
        }).then((r) => {
            removeFromTable(index)
        }).catch(() => {
            message.error('删除失败');
        });
    })
}

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
        title: '已冻结天数',
        render: (val, record) => (
            <span>{parseInt((new Date().getTime() - record.frozenDate*1000)/3600000/24)}天</span>
        )
    },
    {
        title: '操作',
        render: (_, record, index) => (
            <Fragment>
                <a href="#" style={{color: '#ff680d'}} onClick={() => onDeleteClick(index, record.id)}><Icon type="delete"/></a>
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
        fetch.get('/api/blackList/getList', {
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
                    <Breadcrumb.Item>黑名单</Breadcrumb.Item>
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