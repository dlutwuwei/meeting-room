import React, { Fragment } from 'react';
import  { Icon, Divider } from 'antd';

function getColumns(type) {
    let columns;
    switch (type) {
        case 'department':
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
                    render: () => (
                        <Fragment>
                            <a href=""><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href=""><Icon type="delete" /></a>
                        </Fragment>
                    ),
                },
            ];
            break;
        case 'area':
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
                    render: () => (
                        <Fragment>
                            <a href=""><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href=""><Icon type="delete" /></a>
                        </Fragment>
                    ),
                },
            ];
            break;
        case 'rooms':
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
                            <a href=""><Icon type="form" /></a>
                            <Divider type="vertical" />
                            <a href=""><Icon type="delete" /></a>
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