import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from './lib/fetch';
import QueueAnim from 'rc-queue-anim';
import classnames from 'classNames';

import './style/board.less';

const statusMap = ['未知', '预定中', '进行中', '会议被取消', '会议已结束'];

class MeetingBoard extends Component {
    state = {
        loading: true,
        data: {
            list: [],
            page: 1,
            pageSize: 0,
            totalPage: 0,
        }
    }
    page=1
    componentDidMount() {
        this.load();
        this.timer = setInterval(() => {
            this.load();
        }, 20000);
    }
    load() {
        const pageSize = parseInt((window.innerHeight - 414)/98);
        fetch.get('/api/board/getList', {
            page: this.page,
            pageSize,
            token: '40a56c3e9cc9465f60c810f2d26d38c'
        }).then(r => {
            this.setState({
                loading: true
            });
            const totalPage = r.data.totalPage;
            this.page = (++this.page - 1)%totalPage + 1;
            setTimeout(() => {
                this.setState({
                    loading: false,
                    data: r.data
                });
            }, 500);
        }).catch(() => {
            // Modal.error({
            //     content: e.message || e
            // });
            // clearInterval(this.timer);
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
                        {loading ? null : [
                            ...data.list.map((item, i) => {
                                return (<tr key={i+Math.random()}>
                                    <td>{item.brand}</td>
                                    <td>{item.meeting}</td>
                                    <td className={classnames({'active': item.state === 0})}>{statusMap[item.state]}</td>
                                    <td>{item.time}</td>
                                    <td>{item.floor}</td>
                                    <td>{item.room}</td>
                                    <td>{item.organizer}</td>
                                </tr>);
                            }) 
                        ]}
                    </QueueAnim>
                </table>
                <div className="meeting-footer">
                        <span>Last Update:</span><span>{new Date().toLocaleString()}</span>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<MeetingBoard />, document.getElementById('root'));
