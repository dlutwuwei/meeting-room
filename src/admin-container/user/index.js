import React, { PureComponent, Fragment } from 'react';
import { Divider, Icon, Breadcrumb } from 'antd';
import fetch from 'lib/fetch';
import List from '../list';
import getForm from './getForm';

function getColumns(type) {
    let columns = [];
    switch (type) {
        case 'list':
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
        case 'role':
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
        default:
            columns = [];
    }
    return columns;
}

function getBreadcrumb(type) {
    let breadcrumb = <span/>;
    switch(type) {
        case 'list':
            breadcrumb = <Breadcrumb.Item>用户管理</Breadcrumb.Item>;
            break;
        case 'role':
            breadcrumb = <Breadcrumb.Item>角色管理</Breadcrumb.Item>;
            break;
    }
    return breadcrumb;
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
            case 'list':
                return '/api/user/getList';
            case 'role':
                return '/api/role/getList';
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
        }).catch(() => {
            this.setState({
                data: []
            })
        });
    }
    render() {
        const { data, loading, page, pageSize } = this.state;
        const type = this.props.match.params.type;
        return (
            <div className="">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>会议室管理</Breadcrumb.Item>
                    {getBreadcrumb(type)}
                </Breadcrumb>
                <List
                    columns={getColumns(type)}
                    data={data}
                    loading={loading}
                    fetchData={this.fetchData}
                    type={type}
                    page={page}
                    pageSize={pageSize}
                    createForm={getForm(type)}
                />
            </div>
        );
    }
}
