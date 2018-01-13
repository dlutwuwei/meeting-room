import React, { Component } from 'react'
import Button from 'components/button';
import fetch from 'lib/fetch';

import '../style/my-meeting.less';

class MyMeeting extends Component {
    state = {
        data: []
    }
    componentDidMount() {
        this.search(0);
    }
    search(type) {
        fetch.get('/api/Meeting/getList', {
            type,
            token: '40a56c3e9cc9465f60c810f2d26d38c'
        }).then(r => {
            this.setState({
                data: r.data
            });
        });
    }
    render () {
        const { data } = this.state;
        return (
            <div className="my-meeting">
                <div className="my-top">
                    <Button>Not Start</Button><Button>The End</Button>
                </div>
                <div className="my-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Meeting Room</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Create Time</th>
                                <th>Operation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.meeting}</td>
                                            <td>{item.room}</td>
                                            <td>{item.time}</td>
                                            <td>{item.time}</td>
                                            <td>{item.createTime}</td>
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