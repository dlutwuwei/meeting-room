import React, { Component } from 'react'
import { Breadcrumb, Icon, Divider, Checkbox, Row, Col} from 'antd';
const CheckboxGroup = Checkbox.Group;

const areaList = ['北京', '上海'];
const statusList = ['空闲', '会议在', '故障'];
import './index.less';

class Monitor extends Component {
    state = {
        checkedList: []
    }
    onChange = () => {

    }
    render () {
        return (
            <div className="monitor">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>数据监控</Breadcrumb.Item>
                </Breadcrumb>
                <div>
                    <Row>
                        <Col span={2}>
                            区域:
                        </Col>
                        <Col span={16}>
                            <CheckboxGroup options={areaList} value={this.state.checkedList} onChange={this.onChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2}>
                            状态:
                        </Col>
                        <Col span={16}>
                            <CheckboxGroup options={statusList} value={this.state.checkedList} onChange={this.onChange} />
                        </Col>
                    </Row>
                    <div className="room-list">
                        <div className="room-list-header">12F</div>
                        <div className="room-list-body">
                            <span>乌镇</span>
                            <span>鼓浪屿</span>
                            <span>寒山寺</span>
                            <span>杭州</span>
                        </div>
                    </div>
                    <div className="room-list">
                        <div className="room-list-header">13F</div>
                        <div className="room-list-body">
                            <span>乌镇</span>
                            <span>鼓浪屿</span>
                            <span>寒山寺</span>
                            <span>杭州</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Monitor