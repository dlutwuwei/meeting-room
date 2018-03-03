import React, { Fragment } from 'react';
import  { Icon, Divider, Modal, message } from 'antd';
import fetch from 'lib/fetch';

const confirm = Modal.confirm;

function getColumns(type, removeFromTable = () => {}, showEditor = () => {}) {
    let columns, onDeleteClick, onEditClick;
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
    switch (type) {
        case 'list':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/area/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then((r) => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error('删除失败');
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title: '姓名',
                    dataIndex: 'name',
                },
                {
                    title: '邮箱',
                    dataIndex: 'mail',
                },
                {
                    title: '联系方式',
                    dataIndex: 'contact',
                },
                {
                    title: '角色',
                    dataIndex: 'role',
                },
                {
                    title: '是否启用',
                    dataIndex: 'start',
                },
                {
                    title: '操作',
                    render: (text, record, index) => (
                        <Fragment>
                            <a href="#" style={{color: '#00ddc6'}} onClick={() => onEditClick(index, record.id)}><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href="#" style={{color: '#ff680d'}} onClick={removeCurrent}><Icon type="delete"/></a>
                        </Fragment>
                    ),
                },
            ];
            break;
        case 'role':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/area/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then((r) => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error('删除失败');
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title: '角色名称',
                    dataIndex: 'name',
                },
                {
                    title: '权限',
                    dataIndex: 'actions',
                },
                {
                    title: '操作',
                    render: (text, record, index) => (
                        <Fragment>
                            <a href="#" style={{color: '#00ddc6'}} onClick={() => onEditClick(index, record.id)}><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href="#" style={{color: '#ff680d'}} onClick={removeCurrent}><Icon type="delete"/></a>
                        </Fragment>
                    ),
                },
            ];
            break;
        default:
            columns = [];
    }
    return columns;
}

export default getColumns;