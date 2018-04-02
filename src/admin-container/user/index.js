import React, { PureComponent } from 'react';
import { Input, message, Breadcrumb } from 'antd';
import fetch from 'lib/fetch';
import List from '../list';
import getForm from './getForm';

import getColumns from './getColums';
const Search = Input.Search;

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
    getUrl = (type) => {
        switch (type) {
            case 'list':
                return '/api/user/getList';
            case 'role':
                return '/api/role/getList';
        }
    }
    fetchData = (done, page = 1, pageSize = 10) => {
        const type = this.props.match.params.type;
        fetch.get(this.getUrl(type), {
            token: localStorage.getItem('__meeting_token'),
            page,
            pageSize
        }).then(res => {
            done && done();
            if(type === 'list') {
                // 拉取最新role列表
                fetch.get(this.getUrl('role'), {
                    token: localStorage.getItem('__meeting_token')
                }).then(r => {
                    localStorage.setItem('__meeting_role', JSON.stringify(r.data.list || '[]'));
                    this.setState({
                        data: res.data.list,
                        page: res.data.page,
                        pageSize: res.data.pageSize
                    });
                });
            } else if(type === 'role') {
                // role拉取所有权限
                fetch.get('/api/action/getList', {
                    token: localStorage.getItem('__meeting_token')
                }).then(r => {
                    localStorage.setItem('__meeting_actions', JSON.stringify(r.data.list || '[]'));
                    this.setState({
                        data: res.data.list,
                        page: res.data.page,
                        pageSize: res.data.pageSize
                    });
                });
            } else {
                this.setState({
                    data: res.data.list,
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
    render() {
        const { data, loading, page, pageSize } = this.state;
        const type = this.props.match.params.type;
        return (
            <div className="">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>会议室管理</Breadcrumb.Item>
                    {getBreadcrumb(type)}
                </Breadcrumb>
                {type === 'list' && <Search
                    placeholder="input search text"
                    onSearch={this.handleSearch.bind(this, type)}
                    enterButton
                    style={{width: 220, marginTop: 20}}
                />}
                <List
                    getColumns={getColumns.bind(this, type, this.removeFromTable.bind(this))}
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
                    showAdd
                />
            </div>
        );
    }
}
