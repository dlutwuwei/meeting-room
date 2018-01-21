import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import '../style/meeting-nav.less';
import { hello } from '../redux/home-redux';

import Select from 'components/select';
import Button from 'components/button';
import Recurrence from './recurrence';
const Option = Select.Option;

class Nav extends Component {
    state = {
        current: 'appointment',
        showRecurrence: false
    }
    handleChange(val) {
        const { onChange } = this.props;
        this.setState({
            current: val,
            showRecurrence: false
        });
        onChange(val);
    }
    openRecurrence() {
       this.setState({
           showRecurrence: true
       });
    }
    render () {
        const { current, showRecurrence } = this.state;
        return (
            <div className="nav-container">
                <div className="nav-zone">
                    <div className="zone-horizonal">
                        <div className={classNames(['nav-item appointment', { active: current === 'appointment'}])} onClick={() => { this.handleChange('appointment'); }}><div className="appointment-icon"/>Appointment</div>
                        <div className={classNames(['nav-item schedule', { active: current === 'schedule'}])} onClick={() => { this.handleChange('schedule'); }}><div className="schedule-icon"></div>Scheduling Assistant</div>
                    </div>
                    <div className="option-title">Show</div>
                </div>
                <div className="nav-zone nav-zone2">
                    <div className="zone-horizonal">
                        <div className="zone-vertical">
                            <div className="nav-item1">
                                <span className="title showas">Show As:</span>
                                <Select defaultValue="1" style={{ width: 120 }} onChange={(val)=> {
                                    localStorage.setItem('__showas', val);
                                }}>
                                    <Option key="1" value="1">Busy</Option>
                                    <Option key="2"  value="2">Free</Option>
                                    <Option key="3" value="3">Out</Option>
                                </Select>
                            </div>
                            <div className="nav-item1">
                                <span className="title reminder">Reminder:</span>
                                <Select defaultValue="15" style={{ width: 120 }} onChange={(val)=> {
                                    localStorage.setItem('__reminder', val);
                                }}>
                                    <Option key={1} value="15">15 minutes</Option>
                                    <Option key={2} value="30">30 minutes</Option>
                                    <Option key={3} value="45">45 minutes</Option>
                                    <Option key={4} value="60">1 hour</Option>
                                </Select>
                            </div>
                        </div>
                        <Recurrence visible={showRecurrence}/>
                        <div className="nav-item recurrence" onClick={() => { this.openRecurrence(); }}><div className="recurrence-icon" />Recurrence</div>
                        <div className="nav-item time-zone"><div className="time-zone-icon" />TimeZones</div>
                    </div>
                    <div className="option-title">Options</div>
                </div>
                <div className="nav-zone1">
                    <div className="zone-vertical">
                        <div className="nav-item2 private">Private</div>
                        <div className="nav-item2 high">High Important</div>
                        <div className="nav-item2 low">Low Important</div>
                    </div>
                    <div className="option-title">Tag</div>
                </div>
            </div>
        )
    }
}

Nav.defaultProps = {
    onChange: () => {}
};

const mapStateToProps = state => ({
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      hello
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
