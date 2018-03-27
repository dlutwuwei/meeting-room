import React, { Fragment } from 'react';
import  { Icon, Divider, Modal, message, Checkbox, Tag } from 'antd';
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
        });
    }
    const roomTypes = JSON.parse(localStorage.getItem('__meeting_type'));
    switch (type) {
        case 'division':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/division/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
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
                    title: '品牌ID',
                    dataIndex: 'brandId'
                },
                {
                    title: '名称',
                    dataIndex: 'name',
                },
                {
                    title: '描述',
                    dataIndex: 'remark',
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
        case 'device':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/device/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
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
                    title: '名称',
                    dataIndex: 'name',
                },
                {
                    title: '描述',
                    dataIndex: 'description',
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
        case 'brand':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/brand/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
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
                    title: '名称',
                    dataIndex: 'name',
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
        case 'admin':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/brandAdmin/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
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
                    title: '品牌名称',
                    dataIndex: 'brandName',
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                },
                {
                    title: '城市',
                    dataIndex: 'cityNames',
                },
                {
                    title: '邮箱',
                    dataIndex: 'mail',
                },
                {
                    title: '电话',
                    dataIndex: 'tel',
                },
                {
                    title: '职位',
                    dataIndex: 'jobPosition',
                },
                {
                    title: '角色',
                    dataIndex: 'roleName',
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
        case 'room':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post('/api/rooms/delete', {
                        id,
                        token: localStorage.getItem('__meeting_token')
                    }).then(() => {
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
                    title: '品牌',
                    dataIndex: 'brandName',
                },
                {
                    title: '培训室名称',
                    dataIndex: 'name',
                },
                {
                    title: '区域',
                    dataIndex: 'area',
                },
                {
                    title: '部门',
                    dataIndex: 'divisionName',
                },
                {
                    title: '设备',
                    dataIndex: 'deviceNames',
                    render: (item, record) => {
                        return item && item.split(',');
                    }
                },
                {
                    title: '楼层',
                    dataIndex: 'floor',
                },
                {
                    title: '大小',
                    dataIndex: 'capacity',
                },
                {
                    title: '状态',
                    dataIndex: 'state',
                },
                {
                    title: '操作',
                    render: (text, record, index) => (
                        <Fragment>
                            <a href="#" style={{color: '#00ddc6'}} onClick={() => onEditClick(index, record.id)}><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href="#" style={{color: '#ff680d'}}onClick={() => onDeleteClick(index, record.id)}><Icon type="delete"/></a>
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