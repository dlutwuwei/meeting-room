import React, { Component } from 'react'
import { Calendar, message, Modal, Select } from 'antd'
import moment from 'moment';
import './fullCalendar.less';
import fetch from 'lib/fetch';

class FullCalendar extends Component {
    state = {
        data: {},
        year: moment().year()
    }
    onPanelChange = () => {

    }
    headerRender = (i) => {
        return <div style={{ padding: 10 }}>{i + 1}月</div>
    }
    onDateSelect = (date) => {
      const isFestival = this.state.data[date.format('YYYY-MM-DD')].isFestival;
      Modal.confirm({
        title: isFestival ? `取消${date.format('YYYY-MM-DD')}节假日?` : `设置${date.format('YYYY-MM-DD')}为节假日?`,
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.setFestival(date, isFestival)
        },
        onCancel() {

        },
      });
    }
    dateCellRender = (date, i) => {
        const time = date.year(this.state.year).format('YYYY-MM-DD');
        if(this.state.data[time] && this.state.data[time].isFestival && date.month() === i) {
            return <div className="isFestival" date={time}></div>
        }
    }
    setFestival = (date, isFestival) => {
        fetch.post(`/api/festival/toggleFestival`, {
            token: localStorage.getItem('__meeting_token'),
            theDate: date.format('YYYY-MM-DD')
        }).then(() => {
          this.props.fetchData()
          message.info(isFestival ? __('取消节假日成功') : __('增加节假日成功'))
        }).catch(() => {
          message.error( __('设置节假日失败'));
        });
    }
    componentDidMount () {
        this.props.fetchData()
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.data.length){
            const data = {}
            nextProps.data.forEach(el => {
                data[moment(new Date(el.theDate*1000)).format('YYYY-MM-DD')] = el
            });
            this.setState({
                data: data
            })
        }
    }
    handleChange = (val) => {
      this.setState({
        year: val
      }, () => {
        this.props.fetchData(val)
      });
    }
    render() {
        const year = moment().year()
        return (
            <div className="calendar-container">
              <Select className="year-select" defaultValue={year} style={{ width: 120 }} onChange={this.handleChange}>
                {new Array(20).fill('').map((item, i) => <Option value={i + year}>{i + year}</Option>)}
              </Select>
              <div className="calendar-list">
                {new Array(12).fill('').map((item, i) => <Calendar
                    className="calendar-item"
                    key={i}
                    fullscreen={false}
                    headerRender={() => this.headerRender(i)}
                    value={moment().month(i)}
                    onSelect={this.onDateSelect}
                    onPanelChange={this.onPanelChange}
                    dateCellRender={(date) => this.dateCellRender(date, i)}
                ></Calendar>)}
              </div>
            </div>
        )
    }
}

export default FullCalendar