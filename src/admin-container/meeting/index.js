import React, { PureComponent, Fragment } from 'react';
import { Divider, Icon, Breadcrumb } from 'antd';
import fetch from 'lib/fetch';
import List from '../list';

import getForm from './getForm';
import getColumns from './getColums';

function getBreadcrumb(type) {
    let breadcrumb = null;
    switch(type) {
        case 'area':
            breadcrumb = <Breadcrumb.Item>区域管理</Breadcrumb.Item>;
            break;
        case 'department':
            breadcrumb = <Breadcrumb.Item>部门管理</Breadcrumb.Item>;
            break;
        case 'rooms':
            breadcrumb = <Breadcrumb.Item>会议室管理</Breadcrumb.Item>;
            break;
        case 'type':
            breadcrumb = <Breadcrumb.Item>会议室类型管理</Breadcrumb.Item>;
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
            case 'department':
                return '/api/department/getList';
            case 'area':
                return '/api/area/getList';
            case 'rooms':
                return '/api/meetingRoom/getList';
            case 'type':
                return '/api/meetingRoom/getRoomTypes';
        }
    }
    fetchData = () => {
        fetch.get(this.getUrl(), {
            token: localStorage.getItem('__meeting_token')
        }).then(res => {
            this.setState({
                data: res.data.length ? res.data: res.data.list,
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
