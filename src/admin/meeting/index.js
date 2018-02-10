import React, { PureComponent, Fragment } from 'react';
import { Divider, Button, Icon, message, Breadcrumb } from 'antd';
import fetch from 'lib/fetch';
import List from './list';

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


export default class BasicList extends PureComponent {
    state = {
        data: [],
        selectedRows: [],
        loading: false,
        modalVisible: false
    }
    componentDidMount() {
    }
    getUrl = () => {
        const type = this.props.match.params.type;
        switch (type) {
            case 'department':
                return '/api/department/getList';
            case 'area':
                return '/api/area/getList';
            case 'rooms':
                return '/api/meetingRoom/getList';
        }
    }
    fetchData = () => {
        fetch.get(this.getUrl(), {
            token: localStorage.getItem('__meeting_token')
        }).then(res => {
            this.setState({
                data: res.data.list,
                page: res.data.page,
                pageSize: res.data.pageSize
            });
        });
    }
    render() {
        const { data, loading, page, pageSize } = this.state;
        const type = this.props.match.params.type;
        return (
            <div className="">
                <List
                    columns={getColumns(type)}
                    data={data}
                    loading={loading}
                    fetchData={this.fetchData}
                    type={type}
                    page={page}
                    pageSize={pageSize}
                />
            </div>
        );
    }
}
