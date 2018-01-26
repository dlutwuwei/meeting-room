import React, { Component } from 'react'
import Button from 'components/button';
import fetch from 'lib/fetch';
import moment from 'moment';
import '../style/my-meeting.less';

class MyMeeting extends Component {
    state = {
        data: [],
        type: 0
    }
    componentDidMount() {
        this.search(1);
    }
    search(type) {
        fetch.get('/api/meeting/getList', {
            state: type,
            token: localStorage.getItem('__meeting_token')
        }).then(r => {
            this.setState({
                data: r.data.list,
                type
            });
        });
    }
    render () {
        const { data, type } = this.state;
        return (
            <div className="my-meeting">
                <div className="my-top">
                    <Button
                        type={type== 1 ? "primary": ""}
                        onClick={() => { this.search(1); }}
                    >
                        Not Start
                    </Button>
                    <Button
                        type={type== 4 ? "primary": ""}
                        onClick={() => { this.search(4); }}
                    >
                        The End
                    </Button>
                </div>
                <div className="my-table">
                    <table>
                        <thead>
                            <tr>
                                <th>{__('subject')}</th>
                                <th>{__('meetingRoom')}</th>
                                <th>{__('startTime')}</th>
                                <th>{__('endTime')}</th>
                                <th>{__('createTime')}</th>
                                <th>{__('operation')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.subject}</td>
                                            <td>{item.roomNames}</td>
                                            <td>{moment.utc(item.startTime*1000).local().format('YYYY-MM-DD HH:mm')}</td>
                                            <td>{moment.utc(item.endTime*1000).local().format('YYYY-MM-DD HH:mm')}</td>
                                            <td>{moment.utc(item.createTime*1000).local().format('YYYY-MM-DD HH:mm')}</td>
                                            <td></td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default MyMeeting