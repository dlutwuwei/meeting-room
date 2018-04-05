import React, { Component } from 'react'
import Nav from './meeting-nav';

import Appointment from './appointment';
import Schedule from './schedule';

class NMeeting extends Component {
    state = {
        current_show: 0
    }
    handleChange(val) {
        this.setState({
            current_show: val === 'schedule'? 1 : 0
        });
    }
    render () {
        const { current_show } = this.state;
        let content;
        if(current_show === 1) {
            content = <Schedule />;
        } else {
            content = <Appointment />
        }
        return (
            <div className="new-contianer">
                <div className="top"><Nav onChange={(val) => { this.handleChange(val); }} /></div>
                <div className="new-content">
                    {content}
                </div>
            </div>
        )
    }
}

export default NMeeting