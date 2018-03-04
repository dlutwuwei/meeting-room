import React, { Component } from 'react';
import { Form, Modal, Input, Button, AutoComplete } from 'antd';
import fetch from 'lib/fetch';
const Option = AutoComplete.Option;

const FormItem = Form.Item;

class CreateModal extends Component {
    state = {
        loading: false
    }
    render () {
        const { visible, title, onOk, okText, cancelText, onCancel } = this.props;
        const { loading } = this.state;
        return (
            <Modal
                title={title}
                onCancel={() => {
                    this.setState({
                        loading: false
                    });
                    onCancel()
                }}
                visible={visible}
                footer={[
                    <Button key="back" onClick={onCancel}>{cancelText}</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={() => {
                        onOk(() => {
                            this.setState({
                                loading: true
                            });
                        }, () => {
                            this.setState({
                                loading: false
                            });
                        })
                    }}>
                        {okText}
                    </Button>,
                ]}
            >
                {this.props.children}
            </Modal>
        )
    }
}

class SearchUser extends Component {
    state = {
        list: [],
        dataSource: []
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
                    userId: item.userId,
                    name: item.userName,
                    mail: item.mail
                })),
                fetching: false
            });
        });
    }
    okHandle = (before, after) => {
        const { modalVisible, form, handleModalVisible } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            console.log(fieldsValue);
            before && before();
            fetch.post('/api/whitelist/add', {
                token: localStorage.getItem('__meeting_token'),
                ...fieldsValue
            }).then(res => {
                after && after();
                handleModalVisible(false);
            }).catch((e) => {
                handleModalVisible(false);
            });
        });
    };
    render () {
        const { modalVisible, form, handleModalVisible } = this.props;
        const { list, dataSource } = this.state;
        const children = dataSource.map((item, i) => {
            return <Option value={'' + item.userId} key={i}>{item.name}</Option>;
          });
        return (
            <CreateModal
                title="新建名单"
                visible={modalVisible}
                onOk={this.okHandle}
                okText="确定"
                cancelText="取消"
                onCancel={() => handleModalVisible()}
            >
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="用户"
                >
                    {form.getFieldDecorator('userId', {
                        rules: [{ required: true, message: '"请输入名称' }],
                    })(
                        <AutoComplete
                            dataSource={dataSource}
                            style={{ width: 200 }}
                            onSelect={this.onSelect}
                            onSearch={this.handleSearch}
                            placeholder="输入用户名"
                        >
                            {children}
                        </AutoComplete>
                    )}
                </FormItem>
            </CreateModal>
        );
    }
}

export default (type, onCreated) => {
    return Form.create()(SearchUser);
}