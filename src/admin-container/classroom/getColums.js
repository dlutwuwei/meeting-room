import React, { Fragment } from 'react';
import  { Icon, Divider, Modal, message, Tag, Select } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';

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
    const devices = JSON.parse(localStorage.getItem('__meeting_device') || '[]');

    switch (type) {
        case 'division':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/division/delete?token=${localStorage.getItem('__meeting_token')}`, {
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
                    title: '品牌ID',
                    dataIndex: 'brandId'
                },
                {
                    title:  __('名称'),
                    dataIndex: 'name',
                },
                {
                    title:  __('描述'),
                    dataIndex: 'remark',
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
        case 'device':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/device/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error( __('$1'));
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title:  __('名称'),
                    dataIndex: 'name',
                },
                {
                    title:  __( __('描述')),
                    dataIndex: 'description',
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
        case 'brand':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/brand/delete?token=${localStorage.getItem('__meeting_token')}`, {
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
                    title:  __('名称'),
                    dataIndex: 'name',
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
        case 'admin':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/brandAdmin/delete?token=${localStorage.getItem('__meeting_token')}`, {
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
                    title:  __('品牌名称'),
                    dataIndex: 'brandName',
                },
                {
                    title:  __('姓名'),
                    dataIndex: 'name',
                },
                {
                    title:  __('城市'),
                    dataIndex: 'cityNames',
                },
                {
                    title:  __('邮箱'),
                    dataIndex: 'mail',
                },
                {
                    title:  __('电话'),
                    dataIndex: 'tel',
                },
                {
                    title:  __('职位'),
                    dataIndex: 'jobPosition',
                },
                {
                    title:  __('角色'),
                    dataIndex: 'roleName',
                },
                {
                    title:  __('状态'),
                    dataIndex: 'state',
                    render: (text, record) => {
                        return record.state === 1 ? '正常' : '禁用';
                    }
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
        case 'room':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post('/api/trainingRoom/delete', {
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
                    title:  __('部门'),
                    dataIndex: 'divisionName',
                },
                {
                    title:  __('品牌'),
                    dataIndex: 'brandName',
                },
                {
                    title:  __('培训室名称'),
                    dataIndex: 'name',
                },
                {
                    title:  __('城市'),
                    dataIndex: 'cityName'
                },
                // {
                //     title:  __('设备'),
                //     dataIndex: 'deviceNames',
                //     render: (item, record) => {
                //         const ids = record.deviceIds ? record.deviceIds.split(',') : [];
                //         return devices.filter(item => ids.includes(''+item.id)).map(item => (<Tag>{item.name}</Tag>));
                //     }
                // },
                {
                    title:  __('大小'),
                    dataIndex: 'capacity',
                },
                {
                    title:  __('面积'),
                    dataIndex: 'area',
                },
                {
                    title:  __('价格'),
                    dataIndex: 'price',
                },
                {
                    title:  __('楼层'),
                    dataIndex: 'floor',
                },
                {
                    title:  __('状态'),
                    dataIndex: 'state',
                    render: (item, record) => {
                        return [ __('未锁定'),  __('锁定')][record.state];
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
        case 'festival':
            columns = [
                {
                    title:  __('时间'),
                    dataIndex: 'theDate',
                    render: (item) => {
                        return item && new moment(item*1000).format('YYYY-MM-DD');
                    }
                },
                {
                    title:  __('是否节假日'),
                    dataIndex: 'isFestival',
                    render: (item, record) => {
                        // return item ?  __('是') :  __('否');
                        return (<Select defaultValue={''+ (item || false)} onChange={() => {
                            fetch.post(`/api/festival/toggleFestival`, {
                                token: localStorage.getItem('__meeting_token'),
                                theDate: new moment(record.theDate*1000).format('YYYY-MM-DD')
                            }).then(() => {
                                message.info( __('修改节假日成功'))
                            }).catch(() => {
                                message.error( __('修改节假日失败'));
                            });
                        }}>
                            <Option value="true">是</Option>
                            <Option value="false">否</Option>
                        </Select>)
                    }
                }
            ];
            break;
        default:
            columns = [];
    }
    return columns;
}

export default getColumns;