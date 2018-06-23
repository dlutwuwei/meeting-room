import React, { Component, Fragment } from 'react'
import { Table, DatePicker, Input, Select, message, Icon, Divider } from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';
const Option = Select.Option;
const { RangePicker } = DatePicker;

const statusMap = [__('预定中'), __('进行中'), __('已取消'), __('已结束')];

const period = ['', __('上午'), __('下午'), __('全天')];

const brands = JSON.parse(localStorage.getItem('__meeting_brand') || '[]');

const today = new moment();
class TrainList extends Component {
  state = {
    loading: false,
    data: [],
    startDate: today.clone().subtract(1, 'months').format('YYYY-MM-DD'),
    endDate: today.clone().add(1, 'months').format('YYYY-MM-DD'),
    floor: '',
    brandId: brands[0].id,
    keyword: '',
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
  columns = [{
    title: '品牌',
    dataIndex: 'brandName',
  }, {
    title: '部门',
    dataIndex: 'divisionName'
  }, {
    title: '培训室名称',
    dataIndex: 'roomName'
  }, {
    title: '会议主题',
    dataIndex: 'subject'
  }, {
    title: '是否有茶歇',
    dataIndex: 'teaBreak',
    render: (text, record) => {
      return record.teaBreak ? '是' : '否'
    }
  }, {
    title: '是否有午休',
    dataIndex: 'outLunch',
    render: (text, record) => {
      return record.outLunch ? '是' : '否'
    }
  }, {
    title: '人数',
    dataIndex: 'numberOfPeople'
  }, {
    title: '价格',
    dataIndex: 'price'
  }, {
    title: '日期',
    render: (record) => {
      return moment(record.trainingDate*1000).format('YYYY-MM-DD') + ' ' + period[record.periodOfDay];
    }
  }, {
    title: '状态',
    render: (record) => {
      return statusMap[record.state];
    }
  }, {
    title: '操作',
    render: (record) => {
      if(record.state == 0) {
        return (<Fragment>
            {/* <a href="#" style={{color: '#00ddc6'}} onClick={(e) => this.handleModify(e, record.id)}><Icon type="form" /></a>
            <Divider type="vertical" /> */}
            <a href="#" style={{color: '#ff680d'}}onClick={(e) => this.handleCancel(e, record.id)}><Icon type="delete"/></a>
        </Fragment>);
      }
    }
  }];  
  componentDidMount() {
    this.load(1, {});
  }
  handleCancel = (e, id) => {
    fetch.post('/api/training/cancel', {
      token: localStorage.getItem("__meeting_token"),
      id
    }).then(() => {
      this.load(1, {});
    }).catch((e) => {
      message.error(e.message);
    });
  }
  handleModify = (e, id) => {

  }
  load(page, params) {
    let {
      startDate,
      endDate,
      brandId = '',
      keyword,
    } = this.state;
    this.setState({
      loading: true,
      data: [],
      ...params
    });
    fetch.get('/api/training/getList', {
      token: localStorage.getItem('__meeting_token'),
      page: page,
      pageSize: 10,
      startDate,
      endDate,
      brandId,
      keyword,
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
          <RangePicker defaultValue={[today.clone().subtract(1, 'months'), today.clone().add('1', 'months')]} onChange={([val, val1]) => {
            this.load(1, {
              startDate: val.format('YYYY-MM-DD'),
              endDate: val1.format('YYYY-MM-DD')
            });
          }} placeholder={['开始时间', '结束时间']} />
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
            {brands.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
          </Select>
          <Input
            style={{ width: 120 }}
            placeholder="请输入会议主题"
            onChange={(e) => {
              this.load(1, {
                keyword: e.target.value
              });
            }}
          />
        </div>
        {/* <div className="filter-list">
          <Input placeholder="输入楼层" onChange={(e) => {
            this.load(1, {
              floor: e.target.value
            });
          }} />
          <div />
          <div />
        </div> */}
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={data}
          pagination={pagination}
        />
      </div>
    )
  }
}

export default TrainList;
