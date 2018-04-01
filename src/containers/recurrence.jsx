import React, { Component } from 'react';
import { Modal, DatePicker, TimePicker, Checkbox, Radio, Card, message } from 'antd';
import Button from 'components/button';
import Select from 'components/select';
import Input from 'components/input';
import moment from 'moment';
import { generateOptions } from 'lib/util';
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
    return current && current < moment().endOf('day');
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
        startTime: moment().hours(9).minutes(0),
        endTime:  moment().hours(9).minutes(30),
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
        numberOfOccurrences: 1
    }
    componentWillReceiveProps(props) {
        this.setState({
            visible: props.visible
        });
        if(props.visible) {
            let initState = {};

            // 显示保存的值
            const recurrenceJson = JSON.parse(localStorage.getItem('__meeting_recurrenceJson') || '{}');
            if(recurrenceJson.daily) {
                initState = recurrenceJson.daily;
                initState.recurrence_pattern = 1;
            } else if(recurrenceJson.weekly) {
                initState = recurrenceJson.weekly;
                initState.recurrence_pattern = 2;
            } else if(recurrenceJson.monthly) {
                initState = recurrenceJson.monthly;
                initState.recurrence_pattern = 3;
            } else if(recurrenceJson.yearly) {
                initState = recurrenceJson.yearly;
                initState.recurrence_pattern = 4;
            }
            this.setState({
                startTime: moment(props.data.startTime),
                endTime: moment(props.data.endTime),
                ...initState
            });
        }
    }
    search(startTime, endTime, equipment, capacity) {
        fetch.get('/api/meetingRoom/getList', {
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
    componentDidMount() {
        this.search();
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
        this.setState({
            duration: val,
            endTime: this.state.startTime.clone().add(val*30, 'minutes')
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
                this.setState({
                    startTime: time.clone(),
                    endTime: endTime.clone().dayOfYear(date + 1)
                });
            } else {
                this.setState({
                    startTime: time.clone(),
                });
            }
            // this.props.changeProp('startTime', time);
        } else if(type === 'endTime') {
            const date = this.state.startTime.dayOfYear();
            this.setState({
                endTime: time.clone(),
                duration: time.clone().dayOfYear(date).diff(this.state.startTime, 'minutes')/30
            });
            // this.props.changeProp('endTime', time);
        }
    }
    onPatternChange = (e) => {
        this.setState({
            recurrence_pattern: e.target.value
        });
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
                        <Radio value={2}>On the: <Select value={month} style={{width: 90}} onChange={(val) => {
                            this.setState({
                                month: val
                            });
                        }}>{momentOfYear}</Select> of <Select value={weekOfMonth} style={{width: 110}} onChange={(val) => {
                            this.setState({
                                weekOfMonth: val
                            });
                        }}>{weekOfMonthOptions}</Select> <Select value={dayOfWeek} style={{width: 120}} onChange={(val) => {
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
        const { startTime, endTime } = this.props.data;

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
            recurrence_pattern,
            timeZone,
            duration
        } = this.state;

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
                        weekOfMonth,
                        dayOfWeek,
                    }
                };
                break;
            case 4:
                recurrent_parma = {
                    yearly: yearType === 1 ? {
                        everyYear,
                        month
                    } : {
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
        const recurrenceJson = JSON.stringify({
            startTime: startTime.utc().format('HH:mm'),
            endTime: endTime.utc().format('HH:mm'),
            startDate: startTime.utc().format('YYYY-MM-DD'),
            endDate: endTime.utc().format('YYYY-MM-DD'),
            duration: duration*60,
            timeZone,
            ...recurrent_parma
        });
        // 保存信息
        localStorage.setItem('__meeting_recurrenceJson', recurrenceJson);
        this.closeModal();
        this.props.changeProp('isRecurrence', true)

    }
    handleCancel = () => {
        localStorage.setItem('__meeting_recurrenceJson', '');
        message.info('Remove recurrence success');
        this.closeModal();
        this.props.changeProp('isRecurrence', false)
    }
    render () {
        const { visible, timezone, startTime, endTime, duration, recurrence_pattern, endType, numberOfOccurrences } = this.state;
        const offsetUTC = timezone.label.split(' ')[0];
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
                            <RadioGroup className="my-radio-group" onChange={this.onPatternChange} value={this.state.recurrence_pattern}>
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
                                <Radio value={2}>End after: <Input value={numberOfOccurrences} onChange={(val) => {
                                    this.setState({
                                        numberOfOccurrences: val
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
                    <Button type="info" size="large" style={{width: 100}} onClick={() => { this.closeModal()}}>Cancel</Button>
                    <Button type="default" size="large" onClick={this.handleCancel}>Remove Recurrence</Button>
                </div>
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