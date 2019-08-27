import React, {Component} from 'react';
import {
  Table,
  DatePicker,
  Input,
  Select,
  Modal,
  message,
  AutoComplete,
  Button,
} from 'antd';
import fetch from 'lib/fetch';
import moment from 'moment';
import _ from 'lodash';

const Option = Select.Option;
const {RangePicker} = DatePicker;
const confirm = Modal.confirm;

import './charts.less';
const today = new moment();
const statusMap = [
  __('未知'),
  __('预定中'),
  __('进行中'),
  __('已取消'),
  __('已结束'),
];

class Usage extends Component {
  state = {
    loading: false,
    data: [],
    attendees: '',
    userList: [],
    startDate: today
      .clone()
      .subtract(1, 'months')
      .format('YYYY-MM-DD'),
    endDate: today
      .clone()
      .add(1, 'days')
      .format('YYYY-MM-DD'),
    roomName: '',
    roomMail: '',
    from: '',
    floor: '',
    areaId: JSON.parse(localStorage.getItem('__meeting_areas') || '[]')[0].id,
    pagination: {
      position: 'bottom',
      pageSize: 10,
      total: 10,
      current: 1,
      onChange: page => {
        this.load(page, {});
      },
    },
  };
  componentDidMount() {
    this.load(1, {});
  }
  columns = [
    {
      title: __('会议主题'),
      dataIndex: 'subject',
    },
    {
      title: __('预订人'),
      dataIndex: 'userName',
    },
    {
      title: __('房间'),
      dataIndex: 'roomNames',
    },
    {
      title: __('楼层'),
      dataIndex: 'roomFloor',
    },
    {
      title: __('开始时间'),
      dataIndex: 'startTime',
      render: text => {
        return moment(text * 1000).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: __('结束时间'),
      dataIndex: 'endTime',
      render: text => {
        return moment(text * 1000).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: __('状态'),
      dataIndex: 'state',
      render: (text, record) => {
        return record.isComplained ? __('已投诉') : statusMap[record.state];
      },
    },
    {
      title: __('投诉时间'),
      dataIndex: 'complainTime',
      render: text => {
        return text ? moment(text * 1000).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    {
      title: __('操作'),
      key: 'option',
      render: (text, record) => {
        return !record.isComplained ? (
          <div>
            <a
              onClick={() => this.handleComplain(record.id)}
              style={{marginRight: 5}}
            >
              投诉
            </a>
            {(record.state === 2 ||
              record.state === 1 ||
              record.state === 0) && (
              <a onClick={() => this.handleCancel(record.id)}>取消</a>
            )}
          </div>
        ) : null;
      },
    },
  ];
  handleComplain = id => {
    const data = {
      id,
    };
    confirm({
      title: __('投诉确认'),
      content: '投诉不可取消，您确认投诉？',
      onOk: () => {
        fetch
          .post(
            `/api/meetingManage/complain?token=${localStorage.getItem(
              '__meeting_token'
            ) || ''}`,
            data
          )
          .then(() => {
            message.success(__('投诉成功'));
            localStorage.setItem('__meeting_recurrenceJson', '');
          })
          .catch(() => {
            message.error(__('投诉失败'));
          });
      },
      onCancel: () => {},
    });
  };
  handleCancel = id => {
    const data = {
      id,
    };
    confirm({
      title: __('取消会议'),
      content: __('强制取消会议'),
      onOk: () => {
        fetch
          .post(
            `/api/meetingManage/cancel?token=${localStorage.getItem(
              '__meeting_token'
            ) || ''}`,
            data
          )
          .then(() => {
            message.success(__('取消成功'));
            localStorage.setItem('__meeting_recurrenceJson', '');
          })
          .catch(() => {
            message.error(__('取消失败'));
          });
      },
      onCancel: () => {},
    });
  };
  load(page, params) {
    let {startDate, endDate, roomName = '', areaId, floor} = this.state;
    this.setState({
      loading: true,
      data: [],
      ...params,
    });
    fetch
      .get('/api/meetingManage/getMeetingList', {
        token: localStorage.getItem('__meeting_token'),
        page: page,
        pageSize: 10,
        startDate,
        endDate,
        roomName,
        floor,
        areaId,
        ...params,
      })
      .then(r => {
        this.setState({
          loading: true,
        });
        const {page, pageSize, totalPage} = r.data;
        this.setState({
          loading: false,
          data: r.data.list,
          pagination: {
            pageSize,
            current: page,
            total: totalPage * pageSize,
          },
        });
      })
      .catch(() => {
        // Modal.error({
        //     content: e.message || e
        // });
        // clearInterval(this.timer);
        this.setState({
          loading: false,
        });
      });
  }
  handleSelect = val => {
    this.setState({
      attendees: val,
    });
    this.load(1, {
      from: val,
    });
  };
  hanldeUserSelect = val => {
    this.load(1, {
      userName: val.key,
    });
  };
  handleSearch = value => {
    this.setState({
      fetching: true,
    });
    fetch
      .get('/api/user/getList', {
        keyword: value || '',
        token: localStorage.getItem('__meeting_token') || '',
      })
      .then(r => {
        r.data.list.unshift({
          userName: '不限',
          mail: 'all',
          userId: 'undefined',
        });
        this.setState({
          userList: r.data.list.map(item => ({
            name: item.userName,
            mail: item.mail,
            id: item.userId,
          })),
          fetching: false,
        });
      });
  };
  exportMeetings = () => {
    const {startDate, endDate, roomName, roomMail, from, floor} = this.state;
    const url = `/api/meetingManage/exportMeetingList?token=${localStorage.getItem(
      '__meeting_token'
    ) ||
      ''}&startDate=${startDate}&endDate=${endDate}&roomMail=${roomMail}&roomName=${roomName}&from=${from}&floor=${floor}`;
    window.open(url, '_blank');
    // fetch.get('/api/meetingManage/exportMeetingList', {
    //     token: localStorage.getItem('__meeting_token') || '',
    //     startDate,
    //     endDate,
    //     roomMail,
    //     roomName,
    //     from,
    //     floor
    // }).then(() => {
    //   // todo: 生成execl csv

    // });
  };
  handleFileChange = e => {
    const target = e.target;
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    const {startDate, endDate, roomName, roomMail, from, floor} = this.state;
    fetch
      .post(
        `/api/meetingManage/importMeeting?token=${localStorage.getItem(
          '__meeting_token'
        ) ||
          ''}&startDate=${startDate}&endDate=${endDate}&roomMail=${roomMail}&roomName=${roomName}&from=${from}&floor=${floor}`,
        data,
        {}
      )
      .then(() => {
        target.value = '';
        this.load(1, {});
        message.success(__('上传文件成功'));
      })
      .catch(err => {
        console.error(err);
        target.value = '';
        message.error(__('上传文件失败'));
      });
  };
  importMeetings = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };
  render() {
    const {
      // startDate,
      // endDate,
      // roomName='',
      // areaId,
      // floor,
      data,
      pagination,
      loading,
      userList,
    } = this.state;
    const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
    const children = userList.map((item, i) => {
      return (
        <Option value={'' + item.name} key={i}>
          {item.name}
        </Option>
      );
    });
    return (
      <div>
        <div className="filter-list">
          <RangePicker
            defaultValue={[today.clone().subtract(1, 'months'), today]}
            onChange={([val, val1]) => {
              this.load(1, {
                startDate: val
                  .clone()
                  .hours(0)
                  .minutes(0)
                  .utc()
                  .format('YYYY-MM-DD HH:mm'),
                endDate: val1
                  .clone()
                  .add(1, 'days')
                  .hours(0)
                  .minutes(0)
                  .utc()
                  .format('YYYY-MM-DD HH:mm'),
              });
            }}
            placeholder={[__('开始时间'), __('结束时间')]}
          />
          <Select
            style={{width: 120}}
            placeholder={__('请输入区域')}
            defaultValue={areas[0].id}
            onChange={val => {
              this.load(1, {
                areaId: val,
              });
            }}
          >
            {areas.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
          <Input
            placeholder={__('输入会议室名称')}
            onChange={e => {
              this.load(1, {
                roomName: e.target.value,
              });
            }}
          />
          {/* <DatePicker placeholder="输入结束日期" defaultValue={today} onChange={(val) => {
                        this.load(1, {
                            endDate: val.format('YYYY-MM-DD')
                        });
                    }}/> */}
        </div>
        <div className="filter-list">
          <Input
            placeholder={__('输入楼层')}
            onChange={e => {
              this.load(1, {
                floor: e.target.value,
              });
            }}
          />
          <AutoComplete
            dataSource={userList}
            style={{width: 200}}
            onSelect={this.hanldeUserSelect}
            onFocus={_.debounce(this.handleSearch, 200)}
            onBlur={this.hanldeUserSelect}
            onSearch={_.debounce(this.handleSearch, 800)}
            placeholder={__('选择预定人')}
            labelInValue
          >
            {children}
          </AutoComplete>
          <div className="filter-list">
            <Button onClick={this.exportMeetings} type="primary">
              导出会议
            </Button>
            <Button onClick={this.importMeetings} type="primary">
              导入会议
            </Button>
          </div>
        </div>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={data}
          pagination={pagination}
        />
        <input
          ref={ref => (this.fileInput = ref)}
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style={{display: 'none'}}
          onChange={this.handleFileChange}
        />
      </div>
    );
  }
}

export default Usage;
