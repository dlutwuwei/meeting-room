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
    getUrl = (type) => {
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
    fetchData = (done) => {
        const type = this.props.match.params.type;
        fetch.get(this.getUrl(type), {
            token: localStorage.getItem('__meeting_token')
        }).then(res => {
            done && done();
            if(type === 'rooms') {
                // 会议室信息展示需要
                Promise.all([fetch.get(this.getUrl('area'), {
                    token: localStorage.getItem('__meeting_token')
                }), fetch.get(this.getUrl('department'), {
                    token: localStorage.getItem('__meeting_token')
                }), fetch.get(this.getUrl('type'), {
                    token: localStorage.getItem('__meeting_token')
                })]).then(([areas, departments, types]) => {
                    console.log(areas, departments, types);
                    localStorage.setItem('__meeting_areas', JSON.stringify(areas.data.list));
                    localStorage.setItem('__meeting_department', JSON.stringify(departments.data.list));
                    localStorage.setItem('__meeting_type', JSON.stringify(types.data));
                    this.setState({
                        data: res.data.length ? res.data: res.data.list,
                        page: res.data.page,
                        pageSize: res.data.pageSize
                    });
                });
            } else {
                this.setState({
                    data: res.data.length ? res.data: res.data.list,
                    page: res.data.page,
                    pageSize: res.data.pageSize
                });
            }
        }).catch(() => {
            done && done();
            this.setState({
                data: []
            })
        });
    }
    removeFromTable = (i) => {
        this.state.data.splice(i, 1);
        this.setState({
            data: this.state.data.slice()
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
                    getColumns={getColumns.bind(this, type, this.removeFromTable.bind(this))}
                    // columns={getColumns(type, this.removeFromTable.bind(this))}
                    data={data}
                    loading={loading}
                    fetchData={this.fetchData}
                    type={type}
                    page={page}
                    pageSize={pageSize}
                    createForm={getForm(type, () => {
                        // 创建完成之后
                        this.fetchData();
                    })}
                    showAdd={type !== 'type'}
                />
            </div>
        );
    }
}
