import React, { Component } from 'react'
import { Table, Input, Select } from 'antd';
import { DatePicker, MonthPicker } from 'components/pickers';

import fetch from 'lib/fetch';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;
import './sheet.less';

const columns = [{
    title: '培训室信息',
    children: [{
        title: '品牌',
        dataIndex: 'brandName',
        width: 100,
    }, {
        title: '培训室名称',
        dataIndex: 'roomName',
        width: 100,
    }, {
        title: '楼层',
        dataIndex: 'floor',
        width: 100,
    },
    {
        title: '价格',
        width: 100,
        dataIndex: 'price',
    }]
}];

const brands = JSON.parse(localStorage.getItem('__meeting_brand') || '[]');

brands.push({ "BrandDivisions": [], "id": null, "name": "All" })

const areas = [
    {
        id: '1',
        name: '北京'
    },
    {
        id: '2',
        name: '上海'
    }
];
const today = new moment();
class Usage extends Component {
    state = {
        loading: false,
        data: [],
        startDate: today.clone().subtract(1, 'months'),
        endDate: today,
        floor: '',
        brandId: brands[0].id,
        cityId: areas[0].id,
        pagination: {
            position: 'bottom',
            pageSize: 10,
            total: 10,
            current: 1,
            onChange: (page) => {
                this.load(page, {})
            }
        }
    }
    componentDidMount() {
        this.load(1, {}, this.props.match.params.type);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.type !== this.props.match.params.type) {
            this.load(1, {}, nextProps.match.params.type)
        }
    }
    getUrl(type) {
        switch (type) {
            case 'month':
                return '/api/report/getMonthUsageRateList';
            case 'total':
                return '/api/report/getMonthStatisticList';
            case 'day':
                return '/api/report/getDayUsageRateList'
        }
    }
    load(page, params, type = 'month') {
        let {
            startDate,
            endDate,
            brandId = '',
            cityId,
            floor
        } = this.state;
        this.setState({
            loading: true,
            data: [],
            ...params
        });

        fetch.get(this.getUrl(type), {
            token: localStorage.getItem('__meeting_token'),
            page: page,
            pageSize: 10,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            brandId,
            floor,
            cityId,
            ...params
        }).then(r => {
            this.setState({
                loading: true
            });
            // const { page, pageSize, totalPage } = r.data;
            this.setState({
                loading: false,
                data: type === 'total' ? r.data.monthStatistics : r.data,
                // pagination: {
                //     pageSize,
                //     current: page,
                //     total: totalPage * pageSize
                // }
            });

        }).catch(() => {
            // Modal.error({
            //     content: e.message || e
            // });
            // clearInterval(this.timer);
            this.setState({
                loading: false
            });
        })
    }
    getColums(type) {
        const {
            startDate,
            endDate
        } = this.state;
        let filter_columns = columns.slice();
        if (type === 'month') {
            const start = startDate.month();
            const end = (endDate.year() - startDate.year())*12 + endDate.month();
            const x = (end - start + 1) * 150 + 400
            filter_columns[0].fixed = 'left'
            filter_columns.push({
                title: '使用率',
                children: new Array(end - start + 1).fill('').map((_, i) => {
                    return {
                        title: `${(start + i + 1)%12}月`,
                        children: [{
                            title: 'avaliable',
                            dataIndex: `monthRates.${i}.avaliable`,
                        }, {
                            title: 'actual',
                            dataIndex: `monthRates.${i}.actual`,
                        }, {
                            title: 'occRate',
                            dataIndex: `monthRates.${i}.occRate`,
                        }]
                    }
                })
            })
            return {
                filter_columns,
                x
            }
        } else if(type === 'total') {
            filter_columns[0].fixed = ''
            filter_columns = filter_columns.concat([    
                {
                    title: '可用次数',
                    dataIndex: 'avaliableForBookingNumber',
                    width: 100,
                }, 
                {
                    title: '预定次数',
                    width: 100,
                    dataIndex: 'actualBookedNumber',
                }, 
                {
                    title: '使用率',
                    width: 100,
                    dataIndex: 'occupationRate', 
                }
            ])
            return {
                filter_columns,
                x: 1000
            }
        }
    }
    render() {
        const {
            // startDate,
            // endDate,
            // brandId,
            // cityId,
            // floor,
            data, pagination, loading
        } = this.state;

        const type = this.props.match.params.type;

        const {x, filter_columns }= this.getColums(type)
        return (
            <div className="sheet">
                <div className="filter-list">
                    <RangePicker defaultValue={[today.clone().subtract(1, 'months'), today]} onChange={([val, val1]) => {
                        this.load(1, {
                            startDate: val,
                            endDate: val1
                        }, type);
                    }} placeholder={['开始时间', '结束时间']} />
                    <Select
                        style={{ width: 120 }}
                        placeholder="请选择品牌"
                        defaultValue={brands[0].id}
                        onChange={(val) => {
                            this.load(1, {
                                brandId: val
                            },type);
                        }}
                    >
                        {brands.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
                    </Select>
                    <Select
                        style={{ width: 120 }}
                        placeholder="请选择城市"
                        defaultValue={areas[0].id}
                        onChange={(val) => {
                            this.load(1, {
                                cityId: val
                            }, type);
                        }}
                    >
                        {areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
                    </Select>
                </div>
                <div className="filter-list">
                    <Input placeholder="输入楼层" onChange={(e) => {
                        this.load(1, {
                            floor: e.target.value
                        }, type);
                    }} />
                    <div />
                    {/* <div><a target="_blank" className="download-link" href={ `/api/report/exportRoomUseRateList?token=${localStorage.getItem('__meeting_token')}&startDate=${startDate}&endDate=${endDate}&brandId=${brandId}&floor=${floor}&cityId=${cityId}`}>下载报表</a></div> */}
                    <div />
                </div>
                <Table
                    scroll={{ x }}
                    loading={loading}
                    columns={filter_columns}
                    dataSource={data}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default Usage;
