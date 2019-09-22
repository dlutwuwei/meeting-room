import React, { PureComponent } from 'react';
import { Breadcrumb, message, DatePicker, Calendar } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;
import fetch from 'lib/fetch';
import List from '../list';

import getForm from './getForm';
import getColumns from './getColums';
import { AbortController } from 'lib/abort-controller';
import FullCalendar from './fullCalendar';

const abortCtl = new AbortController();

function getBreadcrumb(type) {
    let breadcrumb = null;
    switch(type) {
        case 'device':
            breadcrumb = <Breadcrumb.Item>{__('设备管理')}</Breadcrumb.Item>;
            break;
        case 'brand':
            breadcrumb = <Breadcrumb.Item>{__('品牌管理')}</Breadcrumb.Item>;
            break;
        case 'division':
            breadcrumb = <Breadcrumb.Item>{__('部门管理')}</Breadcrumb.Item>;
            break;
        case 'admin':
            breadcrumb = <Breadcrumb.Item>{__('品牌管理员管理')}</Breadcrumb.Item>;
            break;
        case 'classroom':
            breadcrumb = <Breadcrumb.Item>{__('培训室管理')}</Breadcrumb.Item>;
            break;
        case 'festival':
            breadcrumb = <Breadcrumb.Item>{__('节假日管理')}</Breadcrumb.Item>;
            break;
    }
    return breadcrumb;
}
export default class BasicList extends PureComponent {
    state = {
        data: [],
        selectedRows: [],
        loading: false,
        modalVisible: false,
        startDate: moment().format('YYYY-MM-DD'),
        stopDate: moment().add(1, 'months').format('YYYY-MM-DD')
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
            case 'festival':
                return '/api/festival/getList';
        }
    }
    fetchData = (done, page=1, pageSize=10) => {
        const type = this.props.match.params.type;
        const { startDate, stopDate } = this.state;
        this.setState({
            data: []
        });
        fetch.get(this.getUrl(type), {
            token: localStorage.getItem('__meeting_token'),
            page,
            pageSize,
            ...( type === 'festival' ? { startDate, stopDate } : {})
        }, {
            signal: abortCtl.signal,
        }).then(res => {
            done && done();
            if(type === 'admin' || type == "room") {
                Promise.all([fetch.get(this.getUrl('brand'), {
                    token: localStorage.getItem('__meeting_token')
                }), fetch.get(this.getUrl('division'), {
                    token: localStorage.getItem('__meeting_token')
                }), fetch.get(this.getUrl('device'), {
                    token: localStorage.getItem('__meeting_token')
                })]).then(([brand, division, device ]) => {
                    localStorage.setItem('__train_brand', JSON.stringify(brand.data.list));
                    localStorage.setItem('__train_division', JSON.stringify(division.data.list));
                    localStorage.setItem('__train_device', JSON.stringify(device.data.list));

                    this.setState({
                        data: res.data.length ? res.data: res.data.list,
                        page: res.data.page,
                        pageSize: res.data.pageSize,
                        totalPage: res.data.totalPage,
                        loading: false
                    });
                });
            } else {
                this.setState({
                    data: res.data.length ? res.data: res.data.list,
                    page: res.data.page,
                    pageSize: res.data.pageSize,
                    totalPage: res.data.totalPage,
                    loading: false
                });
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
    handleRange = (dates) => {
        this.setState({
            startDate: dates[0].format('YYYY-MM-DD'),
            stopDate: dates[1].format('YYYY-MM-DD')
        }, () => {
            this.fetchData();
        });
    }
    onPanelChange = () => {

    }
    onSelect = () => {

    }
    render() {
        const { data, loading, page, pageSize, totalPage } = this.state;
        const type = this.props.match.params.type;
        return (
            <div className="">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>{__('培训室管理')}</Breadcrumb.Item>
                    {getBreadcrumb(type)}
                </Breadcrumb>
                {/* { type === 'festival' && <RangePicker
                    className="festival-range"
                    defaultValue={[moment(), moment().add(1, 'months')]}
                    onChange={this.handleRange}
                    disabledDate={(currentDate) => {
                        return currentDate.isBefore(new moment()) || currentDate.isAfter(new moment().add(1, 'months'))
                    }}
                /> } */}
                { type !== 'festival' && <List
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
                    pagination={type!== 'festival'}
                    showAdd={type !== 'type' && type !== 'festival'}
                />}
                {type === 'festival' && <FullCalendar 
                    data={data}
                    onSelect={this.onSelect}
                    fetchData={this.fetchData}
                    onPanelChange={this.onPanelChange}
                />}
            </div>
        );
    }
}
