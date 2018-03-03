import React, { Fragment } from 'react';
import  { Icon, Divider, Modal, message } from 'antd';
import fetch from 'lib/fetch';

const confirm = Modal.confirm;

function getColumns(type, removeFromTable, showEditor) {
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
        case 'department':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/department/delete?token=${localStorage.getItem('__meeting_token')}`, {
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
                    title: '部门名称',
                    dataIndex: 'name',
                },
                {
                    title: '简码',
                    dataIndex: 'shortCode',
                },
                {
                    title: '操作',
                    render: (text, record, index) => {
                        return (
                            <Fragment>
                                <a href="#" style={{color: '#00ddc6'}} onClick={() => onEditClick(index, record.id)}><Icon type="form" /></a>
                                <Divider type="vertical" />
                                <a href="#" style={{color: '#ff680d'}} onClick={() => onDeleteClick(index, record.id)}><Icon type="delete"/></a>
                            </Fragment>
                        )
                    }
                },
            ];
            break;
        case 'area':
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
                    title: '区域名称',
                    dataIndex: 'name',
                },
                {
                    title: '简码',
                    dataIndex: 'shortCode',
                },
                {
                    title: '管理员',
                    dataIndex: 'admin',
                },
                {
                    title: '操作',
                    render: (text, record, index) => (
                        <Fragment>
                            <a href="#" style={{color: '#00ddc6'}} onClick={() => onEditClick(index, record.id)}><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href="#" style={{color: '#ff680d'}} onClick={() => onDeleteClick(index, record.id)}><Icon type="delete"/></a>
                        </Fragment>
                    ),
                },
            ];
            break;
        case 'rooms':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post('/api/meetingRoom/delete', {
                        id,
                        token: localStorage.getItem('__meeting_token')
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
                    title: '会议室名称',
                    dataIndex: 'name',
                },
                {
                    title: '邮箱',
                    dataIndex: 'mail',
                },
                {
                    title: '区域',
                    dataIndex: 'area',
                },
                {
                    title: '部门',
                    dataIndex: 'department',
                },
                {
                    title: '设备',
                    dataIndex: 'device',
                },
                {
                    title: '楼层',
                    dataIndex: 'floor',
                },
                {
                    title: '大小',
                    dataIndex: 'size',
                },
                {
                    title: '会议室类型',
                    dataIndex: 'roomType',
                },
                {
                    title: '设备码',
                    dataIndex: 'deviceCode',
                },
                {
                    title: '可预订',
                    dataIndex: 'canOrder',
                },
                {
                    title: '操作',
                    render: () => (
                        <Fragment>
                            <a href="#" style={{color: '#00ddc6'}} onClick={() => onEditClick(index, record.id)}><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href="#" style={{color: '#ff680d'}}onClick={removeCurrent}><Icon type="delete"/></a>
                        </Fragment>
                    ),
                },
            ];
            break;
        case 'type':
            columns = [
                {
                    title: '会议室类型名称',
                    dataIndex: 'name',
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                }
            ];
            break;
        default:
            columns = [];
    }
    return columns;
}

export default getColumns;