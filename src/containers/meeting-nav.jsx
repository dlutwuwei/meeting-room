import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import '../style/meeting-nav.less';
import { toggleTimezone } from '../redux/home-redux';

import Select from 'components/select';
import Button from 'components/button';
import Recurrence from './recurrence';
const Option = Select.Option;

class Nav extends Component {
    state = {
        current: 'appointment',
        showRecurrence: false,
        showTimezone: false,
        important: 2,
        _priviate: false
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
    handleImportant = (type) => {
        if(type == this.state.important) {
            this.setState({
                important: 2
            });
        } else {
            this.setState({
                important: type
            });
        }
        localStorage.setItem('__meeting_important', type);
    }
    handlePrivate = () => {
        this.setState({
            _private: !this.state._private
        });
        localStorage.setItem('__meeting_private', !this.state._private);
    }
    render () {
        const { current, showRecurrence, _private, important, timezone } = this.state;
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
                                    localStorage.setItem('__meeting_showas', val);
                                }}>
                                    <Option key="1" value="1" className="status busy">忙</Option>
                                    <Option key="2"  value="2" className="status out">外出</Option>
                                    <Option key="3" value="3" className="status interim">暂定</Option>
                                    <Option key="3" value="4" className="status unkown">未知</Option>
                                    <Option key="3" value="5" className="status occupy">在其他地方工作</Option>
                                </Select>
                            </div>
                            <div className="nav-item1">
                                <span className="title reminder">Reminder:</span>
                                <Select defaultValue="15" style={{ width: 120 }} onChange={(val)=> {
                                    localStorage.setItem('__meeting_reminder', val);
                                }}>
                                    <Option key={1} value="15" >15 minutes</Option>
                                    <Option key={2} value="30">30 minutes</Option>
                                    <Option key={3} value="45">45 minutes</Option>
                                    <Option key={4} value="60">1 hour</Option>
                                </Select>
                            </div>
                        </div>
                        <Recurrence
                            visible={showRecurrence}
                            onClose={() => this.setState({ showRecurrence: false})}
                        />
                        <div className="nav-item recurrence" onClick={() => { this.openRecurrence(); }}><div className="recurrence-icon" />Recurrence</div>
                        <div className="nav-item time-zone" onClick={() => {
                            this.props.actions.toggleTimezone(!this.state.showTimezone);
                            this.setState({
                                showTimezone: !this.state.showTimezone
                            });
                        }}><div className="time-zone-icon"/>TimeZones</div>
                    </div>
                    <div className="option-title">Options</div>
                </div>
                <div className="nav-zone1">
                    <div className="zone-vertical">
                        <div className={classNames(["nav-item2 private", { "active": _private}])} onClick={this.handlePrivate}>Private</div>
                        <div className={classNames(["nav-item2 high", { "active": important == 'high' }])} onClick={this.handleImportant.bind(this, 3)}>High Important</div>
                        <div className={classNames(["nav-item2 low", { "active": important == 'low' }])} onClick={this.handleImportant.bind(this, 1)}>Low Important</div>
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
        toggleTimezone
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
