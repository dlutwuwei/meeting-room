import React, { PureComponent } from 'react';
import { Breadcrumb, Input, message} from 'antd';
import fetch from 'lib/fetch';
import List from '../list';

import getForm from './getForm';
import getColumns from './getColums';
const Search = Input.Search;

function getBreadcrumb(type) {
    let breadcrumb = null;
    switch(type) {
        case 'device':
            breadcrumb = <Breadcrumb.Item>设备管理</Breadcrumb.Item>;
            break;
        case 'brand':
            breadcrumb = <Breadcrumb.Item>品牌管理</Breadcrumb.Item>;
            break;
        case 'division':
            breadcrumb = <Breadcrumb.Item>部门管理</Breadcrumb.Item>;
            break;
        case 'admin':
            breadcrumb = <Breadcrumb.Item>品牌管理员管理</Breadcrumb.Item>;
            break;
        case 'classroom':
            breadcrumb = <Breadcrumb.Item>培训室管理</Breadcrumb.Item>;
            break;
        case 'vacation':
            breadcrumb = <Breadcrumb.Item>节假日管理</Breadcrumb.Item>;
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
            case 'device':
                return '/api/device/getList';
            case 'brand':
                return '/api/brand/getList';
            case 'division':
                return '/api/division/getList';
            case 'admin':
                return '/api/brandAdmin/getList';
            case 'room':
                return '/api/trainingRoom/getList';
            case 'vacation':
                return '/api/meetingRoom/getRoomTypes';
        }
    }
    fetchData = (done) => {
        const type = this.props.match.params.type;
        fetch.get(this.getUrl(type), {
            token: localStorage.getItem('__meeting_token')
        }).then(res => {
            done && done();
            this.setState({
                data: res.data.length ? res.data: res.data.list,
                page: res.data.page,
                pageSize: res.data.pageSize
            });
        }).catch(() => {
            done && done();
            this.setState({
                data: []
            })
        });
    }
    handleSearch = (type, val) => {
        this.setState({
            loading: true
        });
        fetch.get(this.getUrl(type), {
            keyword: val,
            token: localStorage.getItem('__meeting_token')
        }).then((res) => {
            this.setState({
                data: res.data.length ? res.data: res.data.list,
                page: res.data.page,
                pageSize: res.data.pageSize,
                loading: false
            });
        })
        .catch(() => {
            this.setState({
                loading: false
            });
            message.error('没有结果')
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
                    <Breadcrumb.Item>培训室管理</Breadcrumb.Item>
                    {getBreadcrumb(type)}
                </Breadcrumb>
                {/* { type === 'rooms' && <Search
                    placeholder="input search text"
                    onSearch={this.handleSearch.bind(this, type)}
                    enterButton
                    style={{width: 220, marginTop: 20}}
                />} */}
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
