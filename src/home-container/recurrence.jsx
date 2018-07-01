import React, { Component } from 'react';
import { Modal, Checkbox, Radio, Card, message } from 'antd';
import { DatePicker, TimePicker } from 'components/pickers';

import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import moment from 'moment';
import { generateOptions, dispatchEvent} from 'lib/util';
import fetch from 'lib/fetch';
import PropTypes from 'prop-types';
import Timezone from '../constant/timezone';
import '../style/recurrence.less';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const children = [];
const zones = Object.keys(Timezone);
for (let i = 0; i < zones.length; i++) {
    const zone = Timezone[zones[i]]
    children.push(<Option key={i} value={zones[i]}>{zone}</Option>);
}

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
}

const durationOptions = new Array(12).fill('').map((item, i) => {
    return <Option key={i} value={i+1}>{(i+1)/2} hours</Option>
});
const eqOptions = [
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
    { label: 'Sunday', value: 0 },
];

const weekOfMonthOptions = [
    <Option key={1} value={1}>first</Option>,
    <Option key={2} value={2}>second</Option>,
    <Option key={3} value={3}>third</Option>,
    <Option key={4} value={4}>fourth</Option>,
    <Option key={5} value={5}>fifth</Option>
];

const dayOfWeekOptions = [
    <Option key={1} value={1}>Monday</Option>,
    <Option key={2} value={2}>Tuesday</Option>,
    <Option key={3} value={3}>Wednesday</Option>,
    <Option key={4} value={4}>Thursday</Option>,
    <Option key={5} value={5}>Friday</Option>,
    <Option key={6} value={6}>Saturday</Option>,
    <Option key={0} value={0}>Sunday</Option>
]
const momentOfYear = [
    <Option key={1} value={1}>January</Option>,
    <Option key={2} value={2}>February</Option>,
    <Option key={3} value={3}>March</Option>,
    <Option key={4} value={4}>April</Option>,
    <Option key={5} value={5}>May</Option>,
    <Option key={6} value={6}>June</Option>,
    <Option key={7} value={7}>July</Option>,
    <Option key={8} value={8}>August</Option>,
    <Option key={9} value={9}>September</Option>,
    <Option key={10} value={10}>October</Option>,
    <Option key={11} value={11}>November</Option>,
    <Option key={12} value={12}>December</Option>
];

class Recurrence extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        visible: false,
        list: [],
        openKeys: [],
        startTime: this.props.data.startTime || moment(),
        endTime:  this.props.data.endTime || moment(),
        recurrence_pattern: 1,
        recurrence: [],
        duration: 1,
        timezone: JSON.parse(localStorage.getItem('__meeting_timezone') || '{ "key": "CCT", "label": "08:00 中国北京时间（俄罗斯伊尔库茨克时区）"}'),
        everyDays: 1,
        everyWorkDay: false,
        everyMonths: 1,
        dayOfMonth: 1,
        weekOfMonth: 1,
        dayOfWeek: 1,
        everyYear: 1,
        month: 1,
        everyWeeks: 1,
        daysOfTheWeek: 0,
        yearType: 1, // 年循环选择星期还是日期，1 or 2
        monthType: 1, // 月循环选择星期还是日期，1 or 2
        noEnd: false, // 是否无线循环
        endType: 1,
        numberOfOccurrences: 1,
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
        // 更新时间
        if(nextProps.visible && !nextProps.isEdit) {
            // edit状态下，不使用redux的值
            const { startTime, endTime } = this.state;
            const day1 = startTime.dayOfYear();
            const day2 = endTime.dayOfYear()
            this.setState({
                visible: nextProps.visible,
                startTime: nextProps.data.startTime.clone().dayOfYear(day1),
                endTime: nextProps.data.endTime.clone().dayOfYear(day2)
            });
        }
    }
    componentDidMount () {
        this.search();
        if(this.props.isEdit) {
            // 第一次打开，加载初始值
            this.initValues();
        }
    }
    getRecurrencePattern = (recurrenceJson) => {
        let pattern = 1;
        if(recurrenceJson.daily) {
            pattern = 1;
        } else if(recurrenceJson.weekly) {
            pattern = 2;
        } else if(recurrenceJson.monthly) {
            pattern = 3;
        } else if(recurrenceJson.yearly) {
            pattern = 4;
        }
        return pattern;
    }
    initValues() {
        let initState = {};
        const props = this.props;
        // 显示保存的值
        initState.recurrence_pattern = this.state.recurrence_pattern;
        const recurrenceJson = props.data.recurrenceJson || JSON.parse(localStorage.getItem('__meeting_recurrenceJson') || '{}');
        initState.recurrence_pattern = this.getRecurrencePattern(recurrenceJson);

       
        const { startTime, endTime } = this.state;
        const day1 = startTime.dayOfYear();
        const day2 = endTime.dayOfYear();
        const startTime1 = recurrenceJson.startDate ? moment(recurrenceJson.startDate + ' ' + recurrenceJson.startTime) : moment();
        const endTime1 = recurrenceJson.endDate ? moment((recurrenceJson.endDate || props.data.endTime.format('YYYY-MM-DD')) + ' ' + recurrenceJson.endTime) : moment();
        this.setState({
            startTime: recurrenceJson.startDate ? startTime1 : (props.data.startTime || moment()).clone().dayOfYear(day1),
            endTime: recurrenceJson.endDate ? endTime1 : (props.data.endTime || moment()).clone().dayOfYear(day2),
            ...initState
        });
    }
    search(startTime, endTime, equipment, capacity) {
        fetch.get('/api/meeting/getRooms', {
            startTime,
            endTime,
            equipment,
            capacity,
            token: localStorage.getItem('__meeting_token') || ''
        }).then(r => {
            this.setState({
                list: r.data.list
            });
        });
    }
    closeModal() {
        this.setState({
            visible: false
        });
        this.props.onClose();
    }
    handleTimezoneChange = (val) => {
        this.setState({
            timezone: val
        });
        localStorage.setItem('__meeting_timezone', JSON.stringify(val));
    }
    handleDuration = (val) => {
        const { startTime, endTime } = this.state;
        const days = endTime.diff(startTime, 'days');
        this.setState({
            duration: val,
            endTime: startTime.clone().add(days, 'days').add(val*30, 'minutes')
        }, () => {
            // this.props.changeProp('startTime', this.state.startTime);
            // this.props.changeProp('endTime', this.state.endTime);
        });
    }
    handleTime = (type, time) => {
        
        if(type === 'startTime') {
            const { startTime, endTime } = this.state;
            const date = startTime.dayOfYear();
            if(startTime.isAfter(endTime)) {
                const hour = startTime.hours()
                this.setState({
                    startTime: time.clone(),
                    endTime: endTime.clone().dayOfYear(date + 1).hours(hour)
                }, () => {
                    dispatchEvent('dataChange', {
                        key: 'startTime',
                        value: time
                    });
                });
            } else {
                this.setState({
                    startTime: time.clone(),
                }, () => {
                    dispatchEvent('dataChange', {
                        key: 'startTime',
                        value: time
                    });
                });
            }
        } else if(type === 'endTime') {
            const date = this.state.startTime.dayOfYear();
            this.setState({
                endTime: time.clone(),
                duration: time.clone().dayOfYear(date).diff(this.state.startTime, 'minutes')/30
            }, () => {
                dispatchEvent('dataChange', {
                    key: 'endTime',
                    value: time
                });
            });
           
        }
    }
    onPatternChange = (e) => {
        this.props.changeProp('recurrence_pattern', e.target.value);
    }
    renderPattern(recurrence_pattern) {
        let pattern;
        const { everyMonths, month, monthType, everyYear, yearType, everyDays, weekOfMonth, daysOfTheWeek, dayOfMonth, dayOfWeek, everyWorkDay, everyWeeks } = this.state;
        switch(recurrence_pattern) {
            case 1:
                pattern = (
                    <RadioGroup value={everyWorkDay ? 2 : 1} onChange={e => {
                        this.setState({
                            everyWorkDay: e.target.value == 2
                        });
                    }}>
                        <Radio value={1}>Every <Input value={everyDays} onChange={(e) => {
                            this.setState({
                                everyDays: e.target.value
                            });
                        }}/> day(s)</Radio>
                        <Radio value={2}>Every work day</Radio>
                    </RadioGroup>
                );
                break;
            case 2:
                pattern = (<div>
                    Recurrent every <Input value={everyWeeks} onChange={(e) => {
                        this.setState({
                            everyWeeks: e.target.value
                        });
                    }}/> week(s) on:
                    <CheckboxGroup options={eqOptions} value={daysOfTheWeek} onChange={(value) => {
                        this.setState({
                            daysOfTheWeek: value
                        })
                    }} />
                </div>);
                break;
            case 3:
                pattern = (<RadioGroup value={monthType} onChange={(e) => {
                    this.setState({
                        monthType: e.target.value
                    });
                }}>
                    <Radio value={1}>Day <Input value={dayOfMonth} onChange={(e) => {
                        this.setState({
                            dayOfMonth: e.target.value
                        });
                    }}/> of every <Input value={everyMonths} onChange={(e) => {
                        this.setState({
                            everyMonths: e.target.value
                        });
                    }}/> month(s)</Radio>
                    <Radio value={2}>The <Select value={weekOfMonth} style={{width: 100, height: 30}} onChange={(val) => {
                        this.setState({
                            weekOfMonth: val
                        });
                    }}>{weekOfMonthOptions}</Select> <Select value={dayOfWeek} style={{width: 100, height: 30}}>{dayOfWeekOptions}</Select>
                     of every <Input value={everyMonths} onChange={(e) => {
                        this.setState({
                            everyMonths: e.target.value
                        })
                     }}/> month(s)</Radio>
                </RadioGroup>);
                break;
            case 4:
                pattern = (<div>
                    <div style={{marginBottom: 6}}>Recur every <Input value={everyYear} onChange={(e) => {
                        this.setState({
                            everyYear: e.target.value
                        });
                    }}/> year(s)</div>
                    <RadioGroup value={yearType} onChange={(e) => {
                        this.setState({
                            yearType: e.target.value
                        });
                    }}>
                        <Radio value={1}>On: <Select value={month} style={{width: 110}} onChange={(val) => {
                            this.setState({
                                month: val
                            });
                        }}>{momentOfYear}</Select> <Input value={dayOfMonth} onChange={(e) => {
                            this.setState({
                                dayOfMonth: e.target.value
                            });
                        }}/></Radio>
                        <Radio value={2}>On the: <Select value={month} style={{width: 120}} onChange={(val) => {
                            this.setState({
                                month: val
                            });
                        }}>{momentOfYear}</Select> of <Select value={weekOfMonth} style={{width: 90}} onChange={(val) => {
                            this.setState({
                                weekOfMonth: val
                            });
                        }}>{weekOfMonthOptions}</Select> <Select value={dayOfWeek} style={{width: 100}} onChange={(val) => {
                            this.setState({
                                dayOfWeek: val
                            });
                        }}>{dayOfWeekOptions}</Select></Radio>
                    </RadioGroup>
                </div>);
                break;
        }
        return pattern;
    }
    handleSubmit = () => {
        // const { startTime, endTime } = this.props.data;

        const {
            everyDays,
            everyWorkDay,

            everyWeeks,
            daysOfTheWeek,

            everyMonths,
            dayOfMonth,
            weekOfMonth,
            dayOfWeek,
            everyYear,
            month,
            monthType,
            yearType,
            endType,
            numberOfOccurrences,
            timeZone,
            duration,
            startTime,
            endTime 
        } = this.state;
        const { recurrence_pattern } = this.state;
        let recurrent_parma = {};
        switch(recurrence_pattern) {
            case 1:
                recurrent_parma = {
                    daily: {
                        everyDays,
                        everyWorkDay
                    }
                }
                break;
            case 2:
                recurrent_parma = {
                    weekly: {
                        everyWeeks,
                        daysOfTheWeek
                    }
                }
                break;
            case 3:
                recurrent_parma = {
                    monthly: monthType === 1 ? {
                        everyMonths,
                        dayOfMonth
                    } : {
                        everyMonths,
                        weekOfMonth,
                        dayOfWeek,
                    }
                };
                break;
            case 4:
                recurrent_parma = {
                    yearly: yearType === 1 ? {
                        everyYear,
                        month,
                        dayOfMonth
                    } : {
                        everyYear,
                        month,
                        weekOfMonth,
                        dayOfWeek,
                    }
                }
                break
        }
        if(endType === 1) {
            recurrent_parma.endDate = null;
        } else if(endType === 2) {
            recurrent_parma.numberOfOccurrences = numberOfOccurrences;
        } else {
            recurrent_parma.endDate = endTime.format('YYYY-MM-DD');
        }
        const start =  startTime;
        const end =  endTime;
        const recurrenceJson = JSON.stringify({
            startTime: start.clone().utc().format('HH:mm'),
            endTime: end.clone().utc().format('HH:mm'),
            startDate: start.clone().utc().format('YYYY-MM-DD'),
            endDate: end.clone().utc().format('YYYY-MM-DD'),
            duration: duration*60,
            timeZone,
            ...recurrent_parma
        });
        // 保存信息
        localStorage.setItem('__meeting_recurrenceJson', recurrenceJson);
        this.closeModal();
        this.props.changeProp('isRecurrence', false)
        this.props.changeProp('isRecurrence', true)

    }
    handleCancel = () => {
        localStorage.setItem('__meeting_recurrenceJson', '');
        message.info('Remove recurrence success');
        this.closeModal();
        this.props.changeProp('isRecurrence', false)
    }
    renderMain = () => {
        const { timezone, startTime, endTime, duration, endType, numberOfOccurrences } = this.state;
        const offsetUTC = timezone.label.split(' ')[0];
        const { recurrence_pattern = 1 } = this.props.data;
        return <div key={Math.random()}>
            <Card className="my-card" title={"Appointment Time"} bordered={false}>
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">Start Time:</label>
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            format="HH:mm"
                            showSecond={false}
                            value={startTime.zone(offsetUTC)}
                            onChange={this.handleTime.bind(this, 'startTime')}
                            hideDisabledOptions={true}
                            disabledHours={() => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={() => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                        />
                        <Select
                            size="default"
                            defaultValue={{key: 'CCT', label: Timezone['CCT']}}
                            value={timezone}
                            labelInValue
                            onChange={this.handleTimezoneChange}
                            style={{ width: 200, marginLeft: 20 }}
                        >
                            {children}
                        </Select>
                    </div>
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">End Time:</label>
                        <TimePicker
                            prefixCls="ant-time-picker"
                            placeholder="Select Time"
                            showSecond={false}
                            value={endTime.zone(offsetUTC)}
                            format="HH:mm"
                            onChange={this.handleTime.bind(this, 'endTime')}
                            hideDisabledOptions={true}
                            disabledHours={() => {
                                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
                            }}
                            disabledMinutes={() => {
                                return generateOptions(60, (m) => {
                                    return m % 30 !== 0
                                });
                            }}
                        />
                        <Select
                            size="default"
                            defaultValue={{key: 'CCT', label: Timezone['CCT']}}
                            value={timezone}
                            labelInValue
                            onChange={this.handleTimezoneChange}
                            style={{ width: 200, marginLeft: 20 }}
                        >
                            {children}
                        </Select>
                    </div>
                    <div className="rcu-item">
                        <label htmlFor="" className="rcu-title">Duration:</label>
                        <Select
                            style={{width: 150}}
                            value={duration}
                            onChange={this.handleDuration}
                        >
                            {durationOptions}
                        </Select>
                    </div>
                </Card>
                <Card className="my-card" title={'Recurrence Pattern'} bordered={false}>
                    <div className="section">
                        <div className="section-left">
                            <RadioGroup className="my-radio-group" onChange={this.onPatternChange} value={recurrence_pattern}>
                                <Radio value={1}>Daily</Radio>
                                <Radio value={2}>Weekly</Radio>
                                <Radio value={3}>Monthly</Radio>
                                <Radio value={4}>Yearly</Radio>
                            </RadioGroup>
                        </div>
                        <div className="section-right">
                            {this.renderPattern(recurrence_pattern)}
                        </div>
                    </div>
                </Card>
                <Card className="my-card" title={'Recurrence Scope'} bordered={false}>
                    <div className="section">
                        <div className="section-left" style={{flex: 2}}>
                            <label htmlFor="" style={{marginRight: 10}}>Start:</label>
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder="Select Date"
                                value={startTime.zone(offsetUTC)}
                                disabledDate={disabledDate}
                                onChange={this.handleTime.bind(this, 'startTime')}
                                className="my-date-picker"
                            />
                        </div>
                        <div className="section-right">
                            <RadioGroup className="my-radio-group" value={endType} onChange={(e) => {
                                this.setState({
                                    endType: e.target.value
                                });
                            }}>
                                <Radio value={1}>No end date</Radio>
                                <Radio value={2}>End after: <Input value={numberOfOccurrences} onChange={(e) => {
                                    this.setState({
                                        numberOfOccurrences: e.target.value
                                    });
                                }}/> occurrences</Radio>
                                <Radio value={3}>End by:
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        placeholder="Select Date"
                                        value={endTime}
                                        disabledDate={disabledDate}
                                        onChange={this.handleTime.bind(this, 'endTime')}
                                        className="my-date-picker"
                                    />
                                </Radio>
                            </RadioGroup>
                        </div>
                    </div>
                </Card>
                <div className="rcu-item rcu-select">
                    <Button type="primary" size="large" style={{width: 100}} onClick={this.handleSubmit}>OK</Button>
                    <Button type="info" size="large" style={{width: 100}} onClick={() => { 
                        this.closeModal();
                    }}>Cancel</Button>
                    <Button type="default" size="large" onClick={this.handleCancel}>Remove Recurrence</Button>
                </div>
        </div>
    }
    render () {
        const { visible } = this.state;
        return (
            <Modal
            title="Add Recurrence"
            style={{ top: 20 }}
            visible={visible}
            width={600}
            onOk={() => this.closeModal()}
            onCancel={() => this.closeModal()}
            footer={null}
            wrapClassName="add-recurrence-container"
            >
                {this.renderMain()}
            </Modal>
        )
    }
}

Recurrence.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    changeProp: PropTypes.func.isRequired
}
export default Recurrence;