import React, { Component } from 'react'
import { Breadcrumb, Icon, Divider, Radio, Row, Col} from 'antd';
import fetch from 'lib/fetch';

const RadioGroup = Radio.Group;

const statusList = ['空闲', '会议在', '故障'];
const statusMap = {
    1: 'free',
    2: 'busy',
    3: 'fault'
}
import './index.less';

class Monitor extends Component {
    state = {
        value: '',
        data: [],
        areas: []
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value
        });
        fetch.get('/api/meetingRoom/deviceMonitor', {
            token: localStorage.getItem('__meeting_token'),
            area: this.state.areas.find(item => item.name === e.target.value).id
        }).then(r => {
            this.setState({
                data: r.data
            });
        }).catch(r => {

        });
    }
    componentDidMount () {
        fetch.get('/api/area/getList', {
            token: localStorage.getItem('__meeting_token')
        }).then(r => {
            this.setState({
                areas: r.data.list.map(item => ({
                    name: item.name,
                    id: item.id
                })),
                value: r.data.list[0].name
            });
            fetch.get('/api/meetingRoom/deviceMonitor', {
                token: localStorage.getItem('__meeting_token'),
                area: r.data.list[0].id
            }).then(r => {
                this.setState({
                    data: r.data
                });
            }).catch(r => {
    
            });
        });
        
    }
    
    render () {
        return (
            <div className="monitor">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>数据监控</Breadcrumb.Item>
                </Breadcrumb>
                <div className="monitor-body">
                    <Row style={{marginTop: 20}}>
                        <Col span={2}>
                            区域:
                        </Col>
                        <Col span={16}>
                            <RadioGroup options={this.state.areas.map(item => item.name)} value={this.state.value} onChange={this.onChange} />
                        </Col>
                    </Row>
                    <Row style={{marginTop: 20}}>
                        <Col span={2}>
                            状态
                        </Col>
                        <Col span={16}>
                            <div className="status">
                                <span className="status-item"><span className="tag free"></span>空闲</span>
                                <span className="status-item"><span className="tag busy"></span>会议中</span>
                                <span className="status-item"><span className="tag fault"></span>故障</span>
                            </div>
                        </Col>
                    </Row>
                    { this.state.data.map(item => {
                        const status = statusMap[item.state]
                        return (
                            <div className="room-list">
                                <div className="room-list-header">{item.name}</div>
                                <div className="room-list-body status">
                                    {item.rooms.map(rm => <span className={status}>{rm.name}</span>)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
}

export default Monitor