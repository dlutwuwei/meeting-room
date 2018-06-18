import React, { Fragment } from 'react';
import  { Icon, Divider, Modal, message, Checkbox, Tag } from 'antd';
import fetch from 'lib/fetch';

const confirm = Modal.confirm;

function getColumns(type, removeFromTable, showEditor) {
    let columns, onDeleteClick, onEditClick;
    const removeCurrent = (delCurrent = () => {}) => {
        confirm({
            title: '确定删除?',
            content:  __('删除后无法恢复'),
            okText:  __('确定'),
            okType: 'danger',
            cancelText:  __('取消'),
            onOk() {
                delCurrent();
            },
        });
    }
    const roomTypes = JSON.parse(localStorage.getItem('__meeting_type'));
    switch (type) {
        case 'department':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/department/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error( __('删除失败'));
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title:  __('部门名称'),
                    dataIndex: 'name',
                },
                {
                    title:  __('简码'),
                    dataIndex: 'shortCode',
                },
                {
                    title:  __('操作'),
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
                    }).then(() => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error( __('删除失败'));
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title:  __('区域名称'),
                    dataIndex: 'name',
                },
                {
                    title:  __('简码'),
                    dataIndex: 'shortCode',
                },
                {
                    title:  __('操作'),
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
                    }).then(() => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error( __('删除失败'));
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title:  __('会议室名称'),
                    dataIndex: 'name',
                },
                {
                    title:  __('邮箱'),
                    dataIndex: 'mail',
                },
                {
                    title:  __('区域'),
                    dataIndex: 'areaName',
                },
                {
                    title:  __('部门'),
                    dataIndex: 'departmentName',
                },
                {
                    title:  __('设备'),
                    dataIndex: 'hasProjector',
                    render: (text, record ) => {
                        const devices = [];
                        if(record.hasProjector) {
                            devices.push(<Tag >{__('投影仪')}</Tag>)
                        }
                        if(record.hasTV) {
                            devices.push(<Tag >{__('电视')}</Tag>)
                        }
                        if(record.hasPhone) {
                            devices.push(<Tag >{__('电话')}</Tag>)
                        }
                        if(record.hasWhiteBoard) {
                            devices.push(<Tag >{__('白板')}</Tag>)
                        }
                        return devices;
                    }
                },
                {
                    title:  __('楼层'),
                    dataIndex: 'floor',
                },
                {
                    title:  __('大小'),
                    dataIndex: 'capacity',
                },
                {
                    title:  __('会议室类型'),
                    dataIndex: 'roomType',
                    render: (text) => {
                        return (roomTypes.find(item => item.RoomType == text)||{}).name
                    }
                },
                {
                    title:  __('设备码'),
                    dataIndex: 'deviceCode',
                },
                {
                    title:  __('可预订'),
                    render: (text, record) => {
                        return <Checkbox checked={record.isEnable}></Checkbox>
                    }
                },
                {
                    title:  __('操作'),
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
                    title:  __('会议室类型名称'),
                    dataIndex: 'name',
                },
                {
                    title:  __('描述'),
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