import React, { Component } from 'react'
import { DatePicker as Date, TimePicker as Time } from 'antd';

class DatePicker extends Component {
    render () {
        return (
            <Date {...this.props} allowClear={false}/>
        )
    }
}

DatePicker.RangePicker = Date.RangePicker;

class TimePicker extends Component {
    render () {
        return (
            <Time {...this.props} allowEmpty={false}/>
        )
    }
}

export default {
    DatePicker,
    TimePicker
};

