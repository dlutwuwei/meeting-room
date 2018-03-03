import React from 'react';
import { Form, Modal, Input } from 'antd';
import fetch from 'lib/fetch';

const FormItem = Form.Item;

export default (type) => {
    switch(type) {
        case 'list':
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
                        title="新建用户"
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="添加"
                        cancelText="取消"
                        onCancel={() => handleModalVisible()}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="姓名"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入姓名' }],
                            })(
                                <Input placeholder="请输入姓名" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="邮箱"
                        >
                            {form.getFieldDecorator('mail', {
                                rules: [{ required: true, message: '请输入邮箱' }],
                            })(
                                <Input placeholder="请输入邮箱" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="联系方式"
                        >
                            {form.getFieldDecorator('contact', {
                                rules: [{ required: true, message: '请输入联系方式' }],
                            })(
                                <Input placeholder="请输入联系方式" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="角色"
                        >
                            {form.getFieldDecorator('role', {
                                rules: [{ required: true, message: '请输入角色' }],
                            })(
                                <Input placeholder="请输入角色" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="是否启用"
                        >
                            {form.getFieldDecorator('role', {
                                rules: [{ required: true, message: '请输入是否启用' }],
                            })(
                                <Input placeholder="请输入是否启用" />
                            )}
                        </FormItem>
                    </Modal>
                );
            });
        case 'role':
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
                        title="新建角色"
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="添加"
                        cancelText="取消"
                        onCancel={() => handleModalVisible()}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="角色名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '"请输入名称' }],
                            })(
                                <Input placeholder="请输入名称" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="权限"
                        >
                            {form.getFieldDecorator('actions', {
                                rules: [{ required: true, message: '请输入简码' }],
                            })(
                                <Input placeholder="请输入简码" />
                            )}
                        </FormItem>
                    </Modal>
                );
            });
    }
}