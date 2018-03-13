import React, { Component } from 'react';
import { Form, Modal, Input, Checkbox, Select, Button, message } from 'antd';
import fetch from 'lib/fetch';
const Option = Select.Option;

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
    switch(type) {
        case 'list':
            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values } = props;
                const okHandle = (before, after) => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        if(values.userId){
                            fieldsValue.id = values.userId;
                            fieldsValue.userName = values.userName;
                        }
                        before && before();
                        fetch.post('/api/user/update', {
                            token: localStorage.getItem('__meeting_token'),
                            ...fieldsValue
                        }).then(() => {
                            handleModalVisible(false);
                            after && after();
                        }).catch(() => {
                            handleModalVisible(false);
                            after && after();
                            message.error('编辑失败')
                        });
                    });
                };
                const roles = JSON.parse(localStorage.getItem('__meeting_role')|| '[]');
                const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
                const departments = JSON.parse(localStorage.getItem('__meeting_department') || '[]');
                return (
                    <CreateModal
                        title="编辑用户"
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="确定"
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
                                initialValue: values.name
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
                                initialValue: values.mail
                            })(
                                <Input placeholder="请输入邮箱" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="联系方式"
                        >
                            {form.getFieldDecorator('tel', {
                                rules: [{ required: false }],
                                initialValue: values.tel
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
                                rules: [{ required: true, message: '请选择角色' }],
                                initialValue: values.role
                            })(
                                <Select style={{ width: 130 }} placeholder="请选择角色" >
                                    {roles.map(item => <Option key={item.id}>{item.name}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="所属区域"
                        >
                            {form.getFieldDecorator('areaId', {
                                rules: [{ required: true, message: '请输入区域' }],
                                initialValue: values.areaId
                            })(
                                <Select style={{ width: 120 }} placeholder="请输入区域" >
                                    { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="所属部门"
                        >
                            {form.getFieldDecorator('departmentId', {
                                rules: [{ required: false, message: '请输入部门' }],
                                initialValue: values.departmentId
                            })(
                                <Select style={{ width: 120 }} placeholder="请输入部门" >
                                    { departments.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="是否启用"
                        >
                            {form.getFieldDecorator('isEnable', {
                                rules: [{ required: true, message: '请输入是否启用' }],
                                initialValue: values.isEnable
                            })(
                                <Checkbox></Checkbox>
                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
        case 'role':
            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values, isEdit } = props;
                const actions = [];
                JSON.parse(localStorage.getItem('__meeting_actions') || '[]').forEach(item => {
                    item.actions.forEach(action => {
                        actions.push(action.action)
                    });
                });
                const okHandle = (before, after) => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        if(values.id) {
                            fieldsValue.id = values.id;
                        }
                        fieldsValue.actions= fieldsValue.actions.join(',');
                        before && before();
                        fetch.post(isEdit? '/api/role/update' : '/api/role/add', {
                            token: localStorage.getItem('__meeting_token'),
                            ...fieldsValue
                        }).then(() => {
                            handleModalVisible(false);
                            onCreated();
                            after && after();
                        }).catch(() => {
                            handleModalVisible(false);
                        });
                    });
                };
                return (
                    <CreateModal
                        title={ isEdit ? "编辑角色" : "新建角色"}
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="确定"
                        cancelText="取消"
                        onCancel={() => handleModalVisible()}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="角色类型"
                        >
                            {form.getFieldDecorator('roleType', {
                                rules: [{ required: true, message: '"请选择类型' }],
                                initialValue: values.roleType
                            })(
                                <Select placeholder="请选择类型" style={{width: '100%'}}>
                                    <Option value="1">超级管理员</Option>
                                    <Option value="2">区域管理员</Option>
                                    <Option value="3">部门管理员</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="角色名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '"请输入名称' }],
                                initialValue: values.name
                            })(
                                <Input placeholder="请输入角色名称" style={{width: '100%'}}/>
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="权限"
                        >
                            {form.getFieldDecorator('actions', {
                                rules: [{ required: true, message: '请选择权限' }],
                                initialValue: values.actions ? values.actions.split(',') : []
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请选择权限"
                                >
                                    {actions.map(item => <Option key={item}>{item}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
    }
}