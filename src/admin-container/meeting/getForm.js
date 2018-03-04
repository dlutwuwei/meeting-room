import React, { Component } from 'react'
import { Form, Modal, Input, Button, message, Select, Checkbox } from 'antd';
import fetch from 'lib/fetch';
const Option = Select.Option;

const FormItem = Form.Item;

class CreateModal extends Component {
    state = {
        loading: false
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.visible !== nextProps.visible) {
            this.setState({
                loading: false
            });
        }
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
    switch (type) {
        case 'area':
            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values, isEdit } = props;
                const okHandle = (before, after) => {
                    before && before();
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        if(values.id) {
                            fieldsValue.id = values.id;
                        }
                        fetch.post(`${isEdit ? '/api/area/update' : '/api/area/add'}?token=${localStorage.getItem('__meeting_token')}`, {
                            token: localStorage.getItem('__meeting_token'),
                            ...fieldsValue
                        }).then(res => {
                            handleModalVisible(false);
                            after && after();
                            onCreated();
                        }).catch((e) => {
                            message.error('修改失败')
                            handleModalVisible(false);
                        });
                    });
                };
                return (
                    <CreateModal
                        title={ isEdit ? '编辑区域' : '新建区域'}
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="确认"
                        cancelText="取消"
                        onCancel={() => handleModalVisible(false)}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="区域名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '"请输入区域名称' }],
                                initialValue: values.name
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
                                initialValue: values.shortCode
                            })(
                                <Input placeholder="请输入简码" />
                            )}
                        </FormItem>
                        {/* <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="管理员"
                        >
                            {form.getFieldDecorator('admin', {
                                rules: [{ required: true, message: '请输入管理员用户名' }],
                            })(
                                <Input placeholder="请输入管理员用户名" />
                            )}
                        </FormItem> */}
                    </CreateModal>
                );
            });
        case 'department':
            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values, isEdit } = props;
                const okHandle = (before, after) => {
                    before && before();
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        if(values.id) {
                            fieldsValue.id = values.id;
                            fieldsValue.areaId = values.areaId;
                        }
                        fetch.post(`${isEdit ? '/api/department/update' : '/api/department/add'}?token=${localStorage.getItem('__meeting_token')}`, {
                            ...fieldsValue
                        }).then(res => {
                            handleModalVisible(false);
                            after && after();
                            onCreated();
                        }).catch((e) => {
                            message.error('修改失败')
                            handleModalVisible(false);
                        });
                    });
                };
                return (
                    <CreateModal
                        title={ isEdit ? '编辑部门' : '新建部门'}
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="确认"
                        cancelText="取消"
                        onCancel={() => handleModalVisible(false)}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="部门名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入名称' }],
                                initialValue: values.name
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="简码"
                        >
                            {form.getFieldDecorator('shortCode', {
                                rules: [{ required: true, message: '请输入简码' }],
                                initialValue: values.shortCode
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
        case 'rooms':
            const deviceChildren = [];
            deviceChildren.push(<Option key={'hasTv'}>电视</Option>);
            deviceChildren.push(<Option key={'hasPhone'}>电话</Option>);
            deviceChildren.push(<Option key={'hasWhiteBoard'}>白板</Option>);
            deviceChildren.push(<Option key={'hasProjector'}>投影仪</Option>);
            const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
            const roomTypes = JSON.parse(localStorage.getItem('__meeting_type') || '[]');
            const departments = JSON.parse(localStorage.getItem('__meeting_department') || '[]');

            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values, isEdit } = props;
                const okHandle = (before, after) => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        before && before();
                        if(values.id) {
                            fieldsValue.id = values.id;
                            fieldsValue.areaId = values.areaId;
                        }
                        fieldsValue.device.forEach(item => {
                            fieldsValue[item] = true
                        });
                        delete fieldsValue.device;
                        debugger
                        fetch.post(`${isEdit ? '/api/meetingRoom/update' : '/api/meetingRoom/add'}?token=${localStorage.getItem('__meeting_token')}`, {
                            ...fieldsValue
                        }).then(res => {
                            handleModalVisible(false);
                            after && after();
                            onCreated();
                        }).catch((e) => {
                            message.error(isEdit ? '修改失败' : '创建失败')
                            handleModalVisible(false);
                        });
                    });
                };
                return (
                    <CreateModal
                        title={ isEdit ? '编辑会议室' : '新建会议室'}
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
                            label="所属区域"
                        >
                            {form.getFieldDecorator('areaId', {
                                rules: [{ required: true, message: '请输入区域' }],
                            })(
                                <Select style={{ width: 120 }} placeholder="请输入区域" >
                                    { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="设备"
                        >
                            {form.getFieldDecorator('device', {
                                rules: [{ required: true, message: '请输入设备' }],
                                initialValue: []
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请选择设备"
                                >
                                    {deviceChildren}
                                </Select>
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
                            {form.getFieldDecorator('roomType', {
                                rules: [{ required: true, message: '请输入类型' }],
                            })(
                                <Select style={{ width: 120 }} placeholder="请输入区域" >
                                    { roomTypes.map((item) => (<Option key={item.RoomType} value={item.RoomType}>{item.name}</Option>)) }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="设备码"
                        >
                            {form.getFieldDecorator('deviceCode', {
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
                            {form.getFieldDecorator('isEnable', {
                                rules: [{ required: true, message: '请输入' }],
                            })(
                                <Checkbox></Checkbox>
                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
        case 'type':
            return null;
    }
}