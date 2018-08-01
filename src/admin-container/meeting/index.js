import React, { PureComponent } from 'react';
import { Breadcrumb, Input, message} from 'antd';
import fetch from 'lib/fetch';
import List from '../list';

import getForm from './getForm';
import getColumns from './getColums';
import { AbortController } from 'lib/abort-controller';

const abortCtl = new AbortController();
const Search = Input.Search;

function getBreadcrumb(type) {
    let breadcrumb = null;
    switch(type) {
        case 'area':
            breadcrumb = <Breadcrumb.Item >{__('区域管理')}</Breadcrumb.Item>;
            break;
        case 'department':
            breadcrumb = <Breadcrumb.Item >{__('部门管理')}</Breadcrumb.Item>;
            break;
        case 'rooms':
            breadcrumb = <Breadcrumb.Item >{__('会议室管理')}</Breadcrumb.Item>;
            break;
        case 'type':
            breadcrumb = <Breadcrumb.Item >{__('会议室类型管理')}</Breadcrumb.Item>;
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
    fetchData = (done, page=1, pageSize=10) => {
        const type = this.props.match.params.type;
        this.setState({
            data: []
        });
        fetch.get(this.getUrl(type), {
            token: localStorage.getItem('__meeting_token'),
            page,
            pageSize
        }, {
            signal: abortCtl.signal
        }).then(res => {
            if(type === 'rooms') {
                // 会议室信息展示需要
                Promise.all([fetch.get(this.getUrl('area'), {
                    token: localStorage.getItem('__meeting_token')
                }), fetch.get(this.getUrl('department'), {
                    token: localStorage.getItem('__meeting_token')
                }), fetch.get(this.getUrl('type'), {
                    token: localStorage.getItem('__meeting_token')
                })]).then(([areas, departments, types]) => {
                    localStorage.setItem('__meeting_areas', JSON.stringify(areas.data.list));
                    localStorage.setItem('__meeting_department', JSON.stringify(departments.data.list));
                    localStorage.setItem('__meeting_type', JSON.stringify(types.data));
                    this.setState({
                        data: res.data.length ? res.data: res.data.list,
                        page: res.data.page,
                        pageSize: res.data.pageSize,
                        totalPage: res.data.totalPage
                    });
                    done && done();
                });
            } else {
                this.setState({
                    data: res.data.length ? res.data: res.data.list,
                    page: res.data.page,
                    pageSize: res.data.pageSize,
                    totalPage: res.data.totalPage,
                });
                done && done();
            }
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
                totalPage: res.data.totalPage,
                loading: false
            });
        })
        .catch(() => {
            this.setState({
                loading: false
            });
            message.error(__('没有结果'))
        });
    }
    removeFromTable = (i) => {
        this.state.data.splice(i, 1);
        this.setState({
            data: this.state.data.slice()
        });
    }
    render() {
        const { data, loading, page, pageSize, totalPage} = this.state;
        const type = this.props.match.params.type;
        return (
            <div className="">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item >{__('会议室管理')}</Breadcrumb.Item>
                    {getBreadcrumb(type)}
                </Breadcrumb>
                { type === 'rooms' && <Search
                    placeholder="input search text"
                    onSearch={this.handleSearch.bind(this, type)}
                    enterButton
                    style={{width: 220, marginTop: 20}}
                />}
                <List
                    getColumns={getColumns.bind(this, type, this.removeFromTable.bind(this))}
                    // columns={getColumns(type, this.removeFromTable.bind(this))}
                    data={data}
                    loading={loading}
                    fetchData={this.fetchData}
                    type={type}
                    page={page}
                    pageSize={pageSize}
                    totalPage={totalPage}
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
