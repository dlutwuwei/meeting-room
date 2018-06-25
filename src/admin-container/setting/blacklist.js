import React, { Component, Fragment } from 'react';
import { Breadcrumb, Icon, Modal, message } from 'antd';
import fetch from 'lib/fetch';
import List from '../list';
const confirm = Modal.confirm;

const removeCurrent = (delCurrent = () => {}) => {
    confirm({
        title: __('确定删除?'),
        content:  __('删除后无法恢复'),
        okText:  __('确定'),
        okType: 'danger',
        cancelText: __('取消'),
        onOk() {
            delCurrent();
        },
        onCancel() {
        },
    });
}


class BlackList extends Component {
    state = {
        data: [],
        selectedRows: [],
        loading: false,
        modalVisible: false
    }
    fetchData = (done) => {
        fetch.get('/api/blackList/getList', {
            token: localStorage.getItem('__meeting_token')
        }).then(res => {
            done && done();
            this.setState({
                data: res.data.list,
                page: res.data.page,
                pageSize: res.data.pageSize,
                totalPage: res.data.totalPage
            });
        }).catch(() => {
            done && done();
            this.setState({
                data: []
            })
        });
    }
    getColumns = () => {
        const removeFromTable = (i) => {
            this.state.data.splice(i, 1);
            this.setState({
                data: this.state.data.slice()
            });
        }
        const onDeleteClick = (index, id) => {
            removeCurrent(() => {
                fetch.post(`/api/blackList/delete?token=${localStorage.getItem('__meeting_token')}`, {
                    id
                }).then(() => {
                    removeFromTable(index)
                }).catch(() => {
                    message.error( __('删除失败'));
                });
            })
        }
        return [{
                title:  __('用户'),
                dataIndex: 'mail',
            },
            {
                title:  __('部门'),
                dataIndex: 'departmentName',
            },
            {
                title:  __('区域'),
                dataIndex: 'area',
            },
            {
                title:  __('已冻结天数'),
                render: (val, record) => (
                    <span>{parseInt((new Date().getTime() - record.frozenDate*1000)/3600000/24)}天</span>
                )
            },
            {
                title:  __('操作'),
                render: (_, record, index) => (
                    <Fragment>
                        <a href="#" style={{color: '#ff680d'}} onClick={() => onDeleteClick(index, record.id)}><Icon type="delete"/></a>
                    </Fragment>
                ),
            },
        ];
    }
    render () {
        const { data, loading, page, pageSize, totalPage } = this.state;

        return (
            <div>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>{__('系统设置')}</Breadcrumb.Item>
                    <Breadcrumb.Item>{__('黑名单')}</Breadcrumb.Item>
                </Breadcrumb>
                <List
                    getColumns={this.getColumns}
                    data={data}
                    loading={loading}
                    fetchData={this.fetchData}
                    page={page}
                    pageSize={pageSize}
                    totalPage={totalPage}
                    showAdd={false}
                />
            </div>
        )
    }
}

export default BlackList