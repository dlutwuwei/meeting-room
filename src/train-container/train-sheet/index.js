import React, { Component } from 'react'
import { Table, Input, Select } from 'antd';
import { DatePicker } from 'components/pickers';

import fetch from 'lib/fetch';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;
import './sheet.less';

const columns = [{
  title: '品牌',
  dataIndex: 'brandName',
}, {
    title: '培训室名称',
    dataIndex: 'roomName'
}, {
  title: '楼层',
  dataIndex: 'floor'
}, {
    title: '可用次数',
    dataIndex: 'totalAvaliable'
},  {
    title: '预定次数',
    dataIndex: 'totalActual'
}, {
    title: '使用率',
    key: 'totalOccRate',
    render: (text, record) => {
        return record.totalOccRate + '%'
    }
}, {
  title: '价格',
  dataIndex: 'price'
}];

const brands = JSON.parse(localStorage.getItem('__meeting_brand')|| '[]');

brands.push({"BrandDivisions":[], "id": null, "name":"All"})

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
        startDate: today.clone().subtract(1, 'months').format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
        floor: '',
        brandId: brands[0].id,
        cityId: areas[0].id,
        pagination:{
            position: 'bottom',
            pageSize: 10,
            total: 10,
            current: 1,
            onChange: (page) => {
                this.load(page, {})
            }
        }
    }
    componentDidMount () {
        this.load(1, {});
    }
    load(page, params) {
        let {
            startDate,
            endDate,
            brandId='',
            cityId,
            floor
        } = this.state;
        this.setState({
            loading: true,
            data: [],
            ...params
        });
        fetch.get('/api/report/getMonthUsageRateList', {
            token: localStorage.getItem('__meeting_token'),
            page: page,
            pageSize: 10,
            startDate,
            endDate,
            brandId,
            floor,
            cityId,
            ...params
        }).then(r => {
            this.setState({
                loading: true
            });
            const { page, pageSize, totalPage } = r.data;
            this.setState({
                loading: false,
                data: r.data.list,
                pagination: {
                    pageSize,
                    current: page,
                    total: totalPage * pageSize
                }
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
    render() {
        const {
            // startDate,
            // endDate,
            // brandId,
            // cityId,
            // floor,
            data, pagination, loading
        } = this.state;
        return (
            <div className="sheet">
                <div className="filter-list">
                    <RangePicker defaultValue={[today.clone().subtract(1, 'months'), today]} onChange={([val, val1]) => {
                        this.load(1, {
                            startDate: val.format('YYYY-MM-DD'),
                            endDate: val1.format('YYYY-MM-DD')
                        });
                    }} placeholder={['开始时间', '结束时间']}/>
                    <Select
                        style={{ width: 120 }}
                        placeholder="请选择品牌"
                        defaultValue={brands[0].id}
                        onChange={(val) => {
                            this.load(1, {
                              brandId: val
                            });
                        }}
                    >
                        { brands.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                    </Select>
                    <Select
                        style={{ width: 120 }}
                        placeholder="请选择城市"
                        defaultValue={areas[0].id}
                        onChange={(val) => {
                            this.load(1, {
                              cityId: val
                            });
                        }}
                    >
                        { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                    </Select>
                </div>
                <div className="filter-list">
                    <Input placeholder="输入楼层" onChange={(e) => {
                        this.load(1, {
                            floor: e.target.value
                        });
                    }}/>
                    <div />
                    {/* <div><a target="_blank" className="download-link" href={ `/api/report/exportRoomUseRateList?token=${localStorage.getItem('__meeting_token')}&startDate=${startDate}&endDate=${endDate}&brandId=${brandId}&floor=${floor}&cityId=${cityId}`}>下载报表</a></div> */}
                    <div />
                </div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                />
            </div>
        )
    }
}

export default Usage;
