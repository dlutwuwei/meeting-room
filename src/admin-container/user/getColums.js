import React, { Fragment } from 'react';
import  { Icon, Divider, Modal, message, Checkbox } from 'antd';
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
                    dataIndex: 'tel',
                },
                {
                    title: '所属区域',
                    dataIndex: 'areaName',
                },
                {
                    title: '所属部门',
                    dataIndex: 'departmentName',
                },
                {
                    title: '角色',
                    dataIndex: 'roleName',
                },
                {
                    title: '是否启用',
                    render: (text, record) => (
                        <Checkbox checked={record.isEnable}></Checkbox>
                    )
                },
                {
                    title: '操作',
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
                    dataIndex: 'actionNames',
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
        default:
            columns = [];
    }
    return columns;
}

export default getColumns;