import React, { Component } from 'react'
import { Calendar, message } from 'antd'
import moment from 'moment';
import './fullCalendar.less';

class FullCalendar extends Component {
    state = {
        data: {}
    }
    onPanelChange = () => {

    }
    headerRender = () => {
        return <div style={{ padding: 10 }}>test</div>
    }
    dateCellRender = (date) => {
        const time = date.format('YYYY-MM-DD');
        if(this.state.data[time]) {
            return <div>+</div>
        }
    }
    setFestival = (date) => {
        fetch.post(`/api/festival/toggleFestival`, {
            token: localStorage.getItem('__meeting_token'),
            theDate: date.format('YYYY-MM-DD')
        }).then(() => {
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
                    headerRender={this.headerRender}
                    value={moment().month(i)}
                    onPanelChange={this.onPanelChange}
                    dateCellRender={this.dateCellRender}
                ></Calendar>)}
            </div>
        )
    }
}

export default FullCalendar