import React, { Component } from 'react';
import { Form, Modal, Input } from 'antd';
import fetch from 'lib/fetch';

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

export default (type, onCreated) => {
    return Form.create()((props) => {
        const { modalVisible, form, handleModalVisible } = props;
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                console.log(fieldsValue);
                fetch.post('/api/area/add', {
                    token: localStorage.getItem('__meeting_token'),
                    ...fieldsValue
                }).then(res => {
                    this.handleModalVisible(false);
                }).catch((e) => {
                    
                });
            });
        };
        return (
            <Modal
                title="新建名单"
                visible={modalVisible}
                onOk={okHandle}
                okText="添加"
                cancelText="取消"
                onCancel={() => handleModalVisible()}
            >
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="用户"
                >
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '"请输入名称' }],
                    })(
                        <Input placeholder="请输入名称" />
                    )}
                </FormItem>
            </Modal>
        );
    });
}