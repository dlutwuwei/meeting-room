import React, { Component } from 'react'
import { Breadcrumb, Icon, Divider, Checkbox, Row, Col} from 'antd';
import fetch from 'lib/fetch';

const CheckboxGroup = Checkbox.Group;

const areaList = ['北京', '上海'];
const statusList = ['空闲', '会议在', '故障'];
import './index.less';

class Monitor extends Component {
    state = {
        checkedList: [],
        data: []
    }
    onChange = () => {

    }
    componentDidMount () {
        fetch.get('/api/meetingRoom/deviceMonitor', {
            area: 2
        }).then(r => {
            this.setState({
                data: r.data
            });
        }).catch(r => {

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
                            <CheckboxGroup options={areaList} value={this.state.checkedList} onChange={this.onChange} />
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
                    { this.state.data.forEach(item => {
                        return (
                            <div className="room-list">
                                <div className="room-list-header">{item.name}</div>
                                <div className="room-list-body status">
                                    {item.rooms.map(rm => <span className="free">{rm.name}</span>)}
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