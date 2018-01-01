import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from './lib/fetch';
import { Spin } from 'antd';
import QueueAnim from 'rc-queue-anim';
import classnames from 'classNames';
import { Modal } from 'antd';

import './style/board.less';

const statusMap = ['Started', 'Scheduled', 'Free'];

function convertToTime(str) {
    const span = str.split('-');
    const start = span[0], end = span[1];
    return `${parseInt(start/2)}:${start%2?'3':'0'}0-${parseInt(end/2)}:${end%2?'3':'0'}0`
}
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
        this.timer = setInterval(() => {
            this.load();
        }, 3000);
    }
    load() {
        fetch.get('/api/board/list', {
            page: 1,
            page_size: 15
        }).then(r => {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.setState({
                    loading: false,
                    data: r.data
                });
            }, 500);
        }).catch(e => {
            Modal.error({
                content: e.message || e
            });
            clearInterval(this.timer);
            this.setState({
                loading: false
            });
        })
    }
    render () {
        const { data, loading } = this.state;
        return (
            <div className="meeting-board-container">
                <div className="meeting-header">
                    <div className="meeting-logo" />
                    <div className="meeting-sub-logo" />
                </div>
                {/* {loading && <Spin size="large" />} */}
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th width="14%">Brand</th>
                            <th width="16%">Meeting</th>
                            <th width="14%">State</th>
                            <th width="14%">Time</th>
                            <th width="14%">Floor</th>
                            <th width="14%">Room</th>
                            <th width="14%">Organizer</th>
                        </tr>
                    </thead>
                    <QueueAnim component="tbody">
                        <tr style={{display : 'none'}}>
                            <td>LOREAL</td>
                            <td>Happy new year</td>
                            <td>Scheduled</td>
                            <td>5:30-6:00</td>
                            <td>5F</td>
                            <td>这个项目是外包的</td>
                            <td>Leo</td>
                        </tr>
                        {loading ? null : [
                            ...data.list.map((item, i) => {
                                return (<tr key={i+1}>
                                    <td>{item.brand}</td>
                                    <td>{item.meeting_topic}</td>
                                    <td className={classnames({'active': item.state === 0})}>{statusMap[item.state]}</td>
                                    <td>{convertToTime(item.time_span)}</td>
                                    <td>{item.floor}</td>
                                    <td>{item.room_name}</td>
                                    <td>{item.organizer}</td>
                                </tr>);
                            }) 
                        ]}
                    </QueueAnim>
                </table>
                <div className="meeting-footer">
                        <span>Last Update:</span><span>{new Date(data.update_time).toLocaleString()}</span>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<MeetingBoard />, document.getElementById('root'));
