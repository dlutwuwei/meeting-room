import React, { Component } from 'react';
import '../style/meeting-nav.less';

import Select from 'components/select';
import Button from 'components/button';

class Nav extends Component {
    render () {
        return (
            <div className="nav-container">
                <div className="nav-zone">
                    <div className="zone-horizonal">
                        <div className="nav-item appointment"><div className="appointment-icon"/>Appointment</div>
                        <div className="nav-item schedule active"><div className="schedule-icon"></div>Scheduling Assistant</div>
                    </div>
                    <div className="option-title">Show</div>
                </div>
                <div className="nav-zone">
                    <div className="zone-horizonal">
                        <div className="zone-vertical">
                            <div className="nav-item1">
                                <span className="title showas">Show As:</span>
                                <Select defaultValue="1" style={{ width: 120 }} onChange={()=> {}}>
                                    <Option value="1">Busy</Option>
                                    <Option value="2">Free</Option>
                                    <Option value="3">Out</Option>
                                </Select>
                            </div>
                            <div className="nav-item1">
                                <span className="title reminder">Reminder:</span>
                                <Select defaultValue="15" style={{ width: 120 }} onChange={()=> {}}>
                                    <Option value="15">15 minutes</Option>
                                    <Option value="30">30 minutes</Option>
                                    <Option value="45">45 minutes</Option>
                                    <Option value="60">1 hour</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="nav-item recurrence"><div className="recurrence-icon" />Recurrence</div>
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

export default Nav