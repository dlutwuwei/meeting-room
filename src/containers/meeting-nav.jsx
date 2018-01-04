import React, { Component } from 'react'
import '../style/meeting-nav.less';

class Nav extends Component {
    render () {
        return (
            <div className="nav-container">
                <div className="nav-zone">
                    <div className="nav-item">Appointment</div>
                    <div className="nav-item">Scheduling Assistant</div>
                </div>
                <div className="nav-zone">
                    <div className="nav-item1">Show As</div>
                    <div className="nav-item1">Reminder</div>
                    <div className="nav-item">Recurrence</div>
                    <div className="nav-item">Time Zones</div>
                </div>
                <div className="nav-zone1">
                    <div className="nav-item2">Private</div>
                    <div className="nav-item2">Hight Important</div>
                    <div className="nav-item2">Low Important</div>
                </div>
            </div>
        )
    }
}

export default Nav