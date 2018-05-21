import React, { Component } from 'react'
import classnames from 'classNames';
import { Spin } from 'antd';

const startHours = 19;
const endHours = 37;

class SceduleTable extends Component {
    render () {
        const { loading = false, data = [], users = [] } = this.props;
        return (
            <Spin spinning={loading}>
                <div className="schedule-contianer">
                    <div className="schedule-main">
                        <div className="schedule-left">
                            <div className="attendees" style={{ paddingTop: 33 }}>
                                {users.map(item => {
                                    return <div style={{ lineHeight: '21px' }}>{item.name}</div>
                                })}
                            </div>
                        </div>
                        <div className="schedule-content" style={{ width: '100%' }}>
                            <div className="table">
                                <div className="line thead">
                                {new Array(endHours - startHours).fill('').map((item, i) => {
                                    const time = i + startHours;
                                    const h = parseInt(time / 2);
                                    const m = time % h * 30 === 0 ? '00' : '30';
                                    return <div className="block">{h}:{m}</div>
                                })}
                                </div>
                                {data.map((item) => {
                                    const line = new Array(endHours - startHours).fill('');
                                    item.forEach(block => {
                                        line.forEach((_, i) => {
                                            const time = i + startHours;
                                            if (time >= block.start && time <= block.end) {
                                                line[i] = block
                                            }
                                        });
                                    });
                                    return (<div className="line">
                                        {line.map((item) => {
                                            const cell = item.status;
                                            return <div
                                                className={classnames(['block', {
                                                    'busy': cell === 2,
                                                    'out': cell === 3,
                                                    'interim': cell === 1,
                                                    'unkown': cell === 5,
                                                    'occupy': cell === 4
                                                }])}
                                            >
                                            </div>
                                        })}
                                    </div>);
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        )
    }
}

export default SceduleTable;
