import React, { Fragment } from 'react';
import  { Icon, Divider, Modal, message, Checkbox } from 'antd';
import fetch from 'lib/fetch';

const confirm = Modal.confirm;

function getColumns(type, removeFromTable = () => {}, showEditor = () => {}) {
    let columns, onDeleteClick, onEditClick;
    const removeCurrent = (delCurrent = () => {}) => {
        confirm({
            title: __('确定删除?'),
            content: __('删除后无法恢复'),
            okText: __('确定'),
            okType: 'danger',
            cancelText: __('取消'),
            onOk() {
                delCurrent();
            },
            onCancel() {
            },
        });
    }
    switch (type) {
        case 'list':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/user/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error(__('删除失败'));
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title: __('姓名'),
                    dataIndex: 'name',
                },
                {
                    title: __('邮箱'),
                    dataIndex: 'mail',
                },
                {
                    title: __('联系方式'),
                    dataIndex: 'tel',
                },
                {
                    title: __('所属区域'),
                    dataIndex: 'areaName',
                },
                {
                    title: __('所属部门'),
                    dataIndex: 'departmentName',
                },
                {
                    title: __('角色'),
                    dataIndex: 'roleName',
                },
                {
                    title: __('是否启用'),
                    render: (text, record) => (
                        <Checkbox checked={record.isEnable}></Checkbox>
                    )
                },
                {
                    title: __('操作'),
                    render: (text, record, index) => (
                        <Fragment>
                            <a href="#" style={{color: '#00ddc6'}} onClick={() => onEditClick(index, record.userId)}><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href="#" style={{color: '#ff680d'}} onClick={() => onDeleteClick(index, record.userId)}><Icon type="delete"/></a>
                        </Fragment>
                    ),
                },
            ];
            break;
        case 'role':
            onDeleteClick = (index, id) => {
                removeCurrent(() => {
                    fetch.post(`/api/role/delete?token=${localStorage.getItem('__meeting_token')}`, {
                        id
                    }).then(() => {
                        removeFromTable(index)
                    }).catch(() => {
                        message.error(__('删除失败'));
                    });
                })
            }
            onEditClick = (index) => {
                showEditor(index);
            }
            columns = [
                {
                    title: __('角色名称'),
                    dataIndex: 'name',
                },
                {
                    title: __('权限'),
                    dataIndex: 'actionNames',
                },
                {
                    title: __('操作'),
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
        default:
            columns = [];
    }
    return columns;
}

export default getColumns;