import React, { Component } from 'react'
import { Spin, Modal, message} from 'antd';
import Button from 'components/button';
import fetch from 'lib/fetch';
import moment from 'moment';
import '../style/my-meeting.less';

import Appointment from './appointment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    batchChangeProp
} from '../redux/home-redux';

class MyMeeting extends Component {
    state = {
        data: [],
        type: 0,
        loading: false,
        visible: false,
        meeting: {},
        selectId: 0
    }
    componentDidMount() {
        this.search(1);
    }
    componentWillUnmount () {
        this.props.actions.batchChangeProp({
            content: '',
            endTime: moment(),
            location: [],
            receivers: [],
            showTimezone: false,
            startTime: moment(),
            subject: ''
        });
    }
    
    handlCancel = (i) => {
        Modal.confirm({
            title: 'Are you sure to cancel the meeting?',
            onOk: () => {
                fetch.post(`/api/meeting/cancel?token=${localStorage.getItem('__meeting_token')}`,{
                    id: this.state.data[i].id
                }).then(() => {
                    this.state.split(i, 1);
                    this.setState({
                        data: this.state.data.slice(),
                    });
                }).catch(() => {
                    message.error('Cancel meeting failed');
                });
            },
            okText: 'Yes'
        });
    }
    handlEdit = (i) => {
        fetch.get('/api/meeting/getItem', {
            token: localStorage.getItem('__meeting_token'),
            id: this.state.data[i].id
        }).then(r => {
            const meetingData = {
                content: r.data.content,
                endTime: moment(r.data.endTime*1000),
                location: r.data.roomMails.split(',').map(mail => ({ mail })),
                receivers: r.data.receiver.split(',').map(mail => ({ mail })),
                showTimezone: false,
                startTime: moment(r.data.startTime*1000),
                subject: r.data.subject
            }
            this.props.actions.batchChangeProp(meetingData);
            this.setState({
                visible: true,
                selectId: this.state.data[i].id
            });
        });
        
    }
    search(type) {
        this.setState({
            loading: true
        })
        fetch.get('/api/meeting/getList', {
            state: type,
            token: localStorage.getItem('__meeting_token')
        }).then(r => {
            this.setState({
                data: r.data.list,
                type,
                loading: false
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
        });
    }
    render () {
        const { data, type, loading, visible, selectId } = this.state;
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
                    <Button
                        type={type== 3 ? "primary": ""}
                        onClick={() => { this.search(3); }}
                    >
                        Canceled
                    </Button>
                </div>
                <div className="my-table">
                    <Spin spinning={loading} delay={500} >
                        <table>
                            <thead>
                                <tr>
                                    <th>{__('subject')}</th>
                                    <th>{__('meetingRoom')}</th>
                                    <th>{__('startTime')}</th>
                                    <th>{__('endTime')}</th>
                                    <th>{__('createTime')}</th>
                                    {type === 1 && <th>{__('operation')}</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((item, i) => {
                                        return (
                                            <tr>
                                                <td>{item.subject}</td>
                                                <td>{item.roomNames}</td>
                                                <td>{moment.utc(item.startTime*1000).local().format('YYYY-MM-DD HH:mm')}</td>
                                                <td>{moment.utc(item.endTime*1000).local().format('YYYY-MM-DD HH:mm')}</td>
                                                <td>{moment.utc(item.createTime*1000).local().format('YYYY-MM-DD HH:mm')}</td>
                                                {type === 1 && <td className="operation"><span onClick={this.handlEdit.bind(this, i)}>Edit</span>&nbsp;|&nbsp;<span onClick={this.handlCancel.bind(this, i)}>cancel</span></td>}
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </Spin>
                </div>
                <Modal
                    width={800}
                    title="Edit meeting"
                    visible={visible}
                    onCancel={() => { this.setState({ visible: false })}}
                    footer={null}
                    destroyOnClose
                >
                    <Appointment isEdit editId={selectId}/>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = () => ({});

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            batchChangeProp,
        }, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(MyMeeting);
