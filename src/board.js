import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from './lib/fetch';
import { Spin } from 'antd';
import './style/board.less';

class MeetingBoard extends Component {
    state = {
        loading: true,
        data: {
            list: [],
            page: 1,
            page_size: 0,
            total_page: 0,
            update_time: 0
        }
    }
    componentDidMount() {
        this.load();
    }
    load() {
        fetch.get('/api/board/list', {
            page: 1,
            page_size: 15
        }).then(r => {
            console.log(r)
            this.setState({
                loading: false,
                data: r.data
            });
        }).catch(e => {
            console.log(e)
            this.setState({
                loading: false
            });
        })
    }
    render () {
        const { data, loading } = this.state;
        if(loading) {
            return <Spin size="large" />
        }
        return (
            <div className="meeting-board-container">
                <div className="meeting-header">
                    <div className="meeting-logo" />
                    <div className="meeting-sub-logo" />
                </div>
                <table className="meeting-table">
                    <tr>
                        <th>Brand</th>
                        <th>Meeting</th>
                        <th>State</th>
                        <th>Time</th>
                        <th>Floor</th>
                        <th>Room</th>
                        <th>Organizer</th>
                    </tr>
                    { data.list.map(item => {
                        return (<tr>
                            <th>{item.brand}</th>
                            <th>{item.meeting_topic}</th>
                            <th>{item.state}</th>
                            <th>{item.time_span}</th>
                            <th>{item.floor}</th>
                            <th>{item.room_name}</th>
                            <th>{item.organizer}</th>
                        </tr>);
                    })}
                </table>
                <div className="meeting-footer">
                    <span>Last Update:</span><span>{new Date(data.update_time).toLocaleString()}</span>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<MeetingBoard />, document.getElementById('root'));
