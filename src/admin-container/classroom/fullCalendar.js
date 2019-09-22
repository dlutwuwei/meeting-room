import React, { Component } from 'react'
import { Calendar, message, Modal } from 'antd'
import moment from 'moment';
import './fullCalendar.less';
import fetch from 'lib/fetch';

class FullCalendar extends Component {
    state = {
        data: {}
    }
    onPanelChange = () => {

    }
    headerRender = (i) => {
        return <div style={{ padding: 10 }}>{i + 1}月</div>
    }
    onDateSelect = (date) => {
      Modal.confirm({
        title: `设置${date.format('YYYY-MM-DD')}为节假日?`,
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.setFestival(date)
        },
        onCancel() {

        },
      });
    }
    dateCellRender = (date) => {
        const time = date.format('YYYY-MM-DD');
        if(this.state.data[time]) {
            return <div className="isFestival"></div>
        }
    }
    setFestival = (date) => {
        fetch.post(`/api/festival/toggleFestival`, {
            token: localStorage.getItem('__meeting_token'),
            theDate: date.format('YYYY-MM-DD')
        }).then(() => {
          this.props.fetchData()
            message.info( __('修改节假日成功'))
        }).catch(() => {
            message.error( __('修改节假日失败'));
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
    render() {
        return (
            <div className="calendar-container">
                {new Array(12).fill('').map((item, i) => <Calendar
                    className="calendar-item"
                    key={i}
                    fullscreen={false}
                    headerRender={() => this.headerRender(i)}
                    value={moment().month(i)}
                    onSelect={this.onDateSelect}
                    onPanelChange={this.onPanelChange}
                    dateCellRender={this.dateCellRender}
                ></Calendar>)}
            </div>
        )
    }
}

export default FullCalendar