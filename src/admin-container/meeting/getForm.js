import React from 'react';
import { Form, Modal, Input } from 'antd';
import fetch from 'lib/fetch';

const FormItem = Form.Item;

export default (type) => {
    switch (type) {
        case 'area':
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
                        title="新建区域"
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="添加"
                        cancelText="取消"
                        onCancel={() => handleModalVisible()}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="区域名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '"请输入区域名称' }],
                            })(
                                <Input placeholder="请输入区域名称" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="简码"
                        >
                            {form.getFieldDecorator('shortCode', {
                                rules: [{ required: true, message: '请输入简码' }],
                            })(
                                <Input placeholder="请输入简码" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="管理员"
                        >
                            {form.getFieldDecorator('admin', {
                                rules: [{ required: true, message: '请输入管理员用户名' }],
                            })(
                                <Input placeholder="请输入管理员用户名" />
                            )}
                        </FormItem>
                    </Modal>
                );
            });
        case 'department':
            return Form.create()((props) => {
                const { modalVisible, form, handleAdd, handleModalVisible } = props;
                const okHandle = () => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        handleAdd(fieldsValue);
                    });
                };
                return (
                    <Modal
                        title="新建部门"
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="添加"
                        cancelText="取消"
                        onCancel={() => handleModalVisible()}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="部门名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入名称' }],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="简码"
                        >
                            {form.getFieldDecorator('code', {
                                rules: [{ required: true, message: '请输入简码' }],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Modal>
                );
            });
        case 'rooms':
            return Form.create()((props) => {
                const { modalVisible, form, handleAdd, handleModalVisible } = props;
                const okHandle = () => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        handleAdd(fieldsValue);
                    });
                };
                return (
                    <Modal
                        title="新建规则"
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="添加"
                        cancelText="取消"
                        onCancel={() => handleModalVisible()}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="会议室名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入会议室名称' }],
                            })(
                                <Input placeholder="请输入会议室名称" />
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
                            label="区域"
                        >
                            {form.getFieldDecorator('area', {
                                rules: [{ required: true, message: '请输入区域' }],
                            })(
                                <Input placeholder="请输入区域" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="设备"
                        >
                            {form.getFieldDecorator('device', {
                                rules: [{ required: true, message: '请输入设备' }],
                            })(
                                <Input placeholder="请输入设备" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="楼层"
                        >
                            {form.getFieldDecorator('floor', {
                                rules: [{ required: true, message: '请输入设备' }],
                            })(
                                <Input placeholder="请输入设备" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="大小"
                        >
                            {form.getFieldDecorator('capacity', {
                                rules: [{ required: true, message: '请输入设备' }],
                            })(
                                <Input placeholder="请输入设备" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="会议室类型"
                        >
                            {form.getFieldDecorator('device', {
                                rules: [{ required: true, message: '请输入类型' }],
                            })(
                                <Input placeholder="请输入类型" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="会议室类型"
                        >
                            {form.getFieldDecorator('device', {
                                rules: [{ required: true, message: '请输入类型' }],
                            })(
                                <Input placeholder="请输入类型" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="设备码"
                        >
                            {form.getFieldDecorator('device', {
                                rules: [{ required: true, message: '请输入类型' }],
                            })(
                                <Input placeholder="请输入类型" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="可预订"
                        >
                            {form.getFieldDecorator('device', {
                                rules: [{ required: true, message: '请输入' }],
                            })(
                                <Input placeholder="请输入类型" />
                            )}
                        </FormItem>
                    </Modal>
                );
            });
        case 'type':
            return Form.create()((props) => {
                const { modalVisible, form, handleAdd, handleModalVisible } = props;
                const okHandle = () => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        handleAdd(fieldsValue);
                    });
                };
                return (
                    <Modal
                        title="新建会议室类型"
                        visible={modalVisible}
                        onOk={okHandle}
                        onCancel={() => handleModalVisible()}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="类型名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入名称' }],
                            })(
                                <Input placeholder="请输入名称" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="描述"
                        >
                            {form.getFieldDecorator('description', {
                                rules: [{ required: true, message: '请输入描述' }],
                            })(
                                <Input placeholder="请输入描述" />
                            )}
                        </FormItem>
                    </Modal>
                );
            });
    }
}