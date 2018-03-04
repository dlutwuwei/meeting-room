import React, { Component } from 'react';
import { Button, Input, Modal, Table, AutoComplete } from 'antd';
import fetch from 'lib/fetch';
const Option = AutoComplete.Option;

class AddAttendees extends Component {
    state = {
        visible: false,
        fetching: false,
        list: [],
        dataSource: []
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }
    getClomuns() {
        return [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: 'Email',
            dataIndex: 'mail',
            key: 'mail'
        }];

    }
    closeModal = () => {
        this.setState({
            visible: false
        });
        this.props.onClose();
    }
    handleSearch = (value) => {
        this.setState({
            fetching: true
        });
        fetch.get('/api/meeting/getAttenders', {
            keyword: value,
            token: localStorage.getItem('__meeting_token') || ''
        }).then((r) => {
            this.setState({
                dataSource: r.data.list.map(item => ({
                    name: item.userName,
                    mail: item.mail
                })),
                fetching: false
            });
        });
    }
    handleSelect = () => {
        this.props.onSelect(this.state.list);
        this.closeModal();
    }
    onSelect = (val) => {
        console.log(val)
        const { list } = this.state;
        if(!list.find(item => item.mail == val.key)) {
            list.push({
                name: val.label,
                mail: val.key
            });
        }
        this.setState({
            list
        });
    }
    render() {
        const { list, dataSource } = this.state;
        const children = dataSource.map((item, i) => {
            return <Option value={item.mail} key={i}>{item.name}</Option>;
          });
        return (
            <Modal
                title="Add Attendees"
                visible={this.state.visible}
                onOk={this.closeModal}
                onCancel={this.closeModal}
                footer={null}
                okText="确认"
                cancelText="取消"
                wrapClassName="add-attendees-container"
            >
                <AutoComplete
                    dataSource={dataSource}
                    style={{ width: 200 }}
                    onSelect={this.onSelect}
                    onSearch={this.handleSearch}
                    placeholder="input here"
                    labelInValue
                >
                    {children}
                </AutoComplete>
                <Table
                    bordered
                    columns={this.getClomuns()}
                    dataSource={list}
                    style={{ marginTop: 20 }}
                    pagination={false}
                />
                <div className="attendees-select">
                    <Button
                        type="primary"
                        size="large"
                        style={{width: 128}}
                        disabled={this.state.list.length == 0}
                        onClick={this.handleSelect}
                    >
                        Select
                    </Button>
                </div>
                
            </Modal>

        )
    }
}

export default AddAttendees;