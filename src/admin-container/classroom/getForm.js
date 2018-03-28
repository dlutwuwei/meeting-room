import React, { Component } from 'react'
import { Form, Modal, Input, Button, message, Select, Checkbox, DatePicker } from 'antd';
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
    let deviceChildren, areas, roomTypes, departments;
    switch (type) {
        case 'device':
            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values, isEdit } = props;
                const okHandle = (before, after) => {
                    before && before();
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        if(values.id) {
                            fieldsValue.id = values.id;
                        }
                        fetch.post(`${isEdit ? '/api/device/update' : '/api/device/add'}?token=${localStorage.getItem('__meeting_token')}`, {
                            token: localStorage.getItem('__meeting_token'),
                            ...fieldsValue
                        }).then(() => {
                            handleModalVisible(false);
                            after && after();
                            onCreated();
                        }).catch(() => {
                            message.error('修改失败')
                            handleModalVisible(false);
                        });
                    });
                };
                return (
                    <CreateModal
                        title={ isEdit ? '编辑设备' : '新建设备'}
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="确认"
                        cancelText="取消"
                        onCancel={() => handleModalVisible(false)}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="设备名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '"请输入设备名称' }],
                                initialValue: values.name
                            })(
                                <Input placeholder="请输入设备名称" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="描述"
                        >
                            {form.getFieldDecorator('description', {
                                rules: [{ required: false, message: '请输入描述' }],
                                initialValue: values.description || ''
                            })(
                                <Input placeholder="请输入描述" />
                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
        case 'brand':
            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values, isEdit } = props;
                const okHandle = (before, after) => {
                    before && before();
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        if(values.id) {
                            fieldsValue.id = values.id;
                        }
                        fetch.post(`${isEdit ? '/api/brand/update' : '/api/brand/add'}?token=${localStorage.getItem('__meeting_token')}`, {
                            token: localStorage.getItem('__meeting_token'),
                            ...fieldsValue
                        }).then(() => {
                            handleModalVisible(false);
                            after && after();
                            onCreated();
                        }).catch(() => {
                            message.error('修改失败')
                            handleModalVisible(false);
                        });
                    });
                };
                return (
                    <CreateModal
                        title={ isEdit ? '编辑品牌' : '新建品牌'}
                        visible={modalVisible}
                        onOk={okHandle}
                        okText="确认"
                        cancelText="取消"
                        onCancel={() => handleModalVisible(false)}
                    >
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="品牌名称"
                        >
                            {form.getFieldDecorator('name', {
                                rules: [{ required: true, message: '"请输入品牌名称' }],
                                initialValue: values.name
                            })(
                                <Input placeholder="请输入品牌名称" />
                            )}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="描述"
                        >
                            {form.getFieldDecorator('description', {
                                rules: [{ required: false, message: '请输入描述' }],
                                initialValue: values.description || ''
                            })(
                                <Input placeholder="请输入描述" />
                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
        case 'division':
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
                        fetch.post(`${isEdit ? '/api/division/update' : '/api/division/add'}?token=${localStorage.getItem('__meeting_token')}`, {
                            ...fieldsValue
                        }).then(() => {
                            handleModalVisible(false);
                            after && after();
                            onCreated();
                        }).catch(() => {
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
                            label="品牌ID"
                        >
                            {form.getFieldDecorator('brandId', {
                                rules: [{ required: true, message: '请输入名称' }],
                                initialValue: values.brandId
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
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
                            label="描述"
                        >
                            {form.getFieldDecorator('remark', {
                                rules: [{ required: true, message: '请输入描述' }],
                                initialValue: values.remark
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
        case 'admin':
            return Form.create()((props) => {
                const { modalVisible, form, handleModalVisible, values, isEdit } = props;
                const okHandle = (before, after) => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        if(values.userId){
                            fieldsValue.id = values.userId;
                            fieldsValue.userName = values.userName;
                        }
                        before && before();
                        fetch.post(isEdit ? '/api/user/update' : '/api/user/add', {
                            token: localStorage.getItem('__meeting_token'),
                            ...fieldsValue
                        }).then(() => {
                            handleModalVisible(false);
                            onCreated();
                            after && after();
                        }).catch(() => {
                            handleModalVisible(false);
                            after && after();
                            message.error('编辑失败')
                        });
                    });
                };
                const roles = JSON.parse(localStorage.getItem('__meeting_role')|| '[]');
                const areas = [
                    {
                        id: '1',
                        name: '北京'
                    },
                    {
                        id: '2',
                        name: '上海'
                    }
                ];
                debugger
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
                            label="品牌ID"
                        >
                            {form.getFieldDecorator('brandId', {
                                rules: [{ required: true, message: '请输入品牌ID' }],
                                initialValue: values.name
                            })(
                                <Input placeholder="请输入品牌ID" />
                            )}
                        </FormItem>
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
                            label="域用户名"
                        >
                            {form.getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入域用户名' }],
                                initialValue: values.userName
                            })(
                                <Input placeholder="请输入域用户名" />
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
                        {/* <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="角色"
                        >
                            {form.getFieldDecorator('roleId', {
                                rules: [{ required: true, message: '请选择角色' }],
                                initialValue: '' + (values.roleId || '')
                            })(
                                <Select style={{ width: 130 }} placeholder="请选择角色" >
                                    {roles.map(item => <Option key={item.id} value={'' + item.id}>{item.name}</Option>)}
                                </Select>
                            )}
                        </FormItem> */}
                        {/* <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="城市"
                        >
                            {form.getFieldDecorator('cityIds', {
                                rules: [{ required: true, message: '请输入区域' }],
                                initialValue: (values.cityIds || '').split(',')
                            })(
                                <Select mode="multiple"  style={{ width: 120 }} placeholder="请输入区域" >
                                    { areas.map((item) => (<Option key={item.id} value={'' + item.id}>{item.name}</Option>)) }
                                </Select>
                            )}
                        </FormItem> */}
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="职位"
                        >
                            {form.getFieldDecorator('jobPosition', {
                                rules: [{ required: false, message: '请输入职位' }],
                                initialValue: values.jobPosition
                            })(
                                <Input style={{ width: 120 }} placeholder="请输入职位" />

                            )}
                        </FormItem>
                    </CreateModal>
                );
            });
        // case 'room':
        //     deviceChildren = [];
        //     deviceChildren.push(<Option key={'hasTv'}>电视</Option>);
        //     deviceChildren.push(<Option key={'hasPhone'}>电话</Option>);
        //     deviceChildren.push(<Option key={'hasWhiteBoard'}>白板</Option>);
        //     deviceChildren.push(<Option key={'hasProjector'}>投影仪</Option>);
        //     areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
        //     roomTypes = JSON.parse(localStorage.getItem('__meeting_type') || '[]');
        //     departments = JSON.parse(localStorage.getItem('__meeting_department') || '[]');
            
        //     return Form.create()((props) => {
        //         const { modalVisible, form, handleModalVisible, values, isEdit } = props;
        //         const devices = [];
        //         Object.keys(values).forEach(item => {
        //             if(['hasTv', 'hasPhone', 'hasWhiteBoard', 'hasProjector'].includes(item)) {
        //                 devices.push(item);
        //             }
        //         });
        //         const okHandle = (before, after) => {
        //             form.validateFields((err, fieldsValue) => {
        //                 if (err) return;
        //                 before && before();
        //                 if(values.id) {
        //                     fieldsValue.id = values.id;
        //                     fieldsValue.areaId = values.areaId;
        //                 }
        //                 fieldsValue.devices.forEach(item => {
        //                     fieldsValue[item] = true
        //                 });
        //                 delete fieldsValue.devices;
        //                 fieldsValue.device = fieldsValue.deviceCode;
        //                 fetch.post(`${isEdit ? '/api/meetingRoom/update' : '/api/meetingRoom/add'}?token=${localStorage.getItem('__meeting_token')}`, {
        //                     ...fieldsValue
        //                 }).then(() => {
        //                     handleModalVisible(false);
        //                     after && after();
        //                     onCreated();
        //                 }).catch(() => {
        //                     message.error(isEdit ? '修改失败' : '创建失败')
        //                     handleModalVisible(false);
        //                 });
        //             });
        //         };
        //         return (
        //             <CreateModal
        //                 title={ isEdit ? '编辑会议室' : '新建会议室'}
        //                 visible={modalVisible}
        //                 onOk={okHandle}
        //                 okText="确定"
        //                 cancelText="取消"
        //                 onCancel={() => handleModalVisible()}
        //             >
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="会议室名称"
        //                 >
        //                     {form.getFieldDecorator('name', {
        //                         rules: [{ required: true, message: '请输入会议室名称' }],
        //                         initialValue: values.name
        //                     })(
        //                         <Input placeholder="请输入会议室名称" />
        //                     )}
        //                 </FormItem>
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="邮箱"
        //                 >
        //                     {form.getFieldDecorator('mail', {
        //                         rules: [{ required: true, message: '请输入邮箱' }],
        //                         initialValue: values.mail
        //                     })(
        //                         <Input placeholder="请输入邮箱" />
        //                     )}
        //                 </FormItem>
        //                 {/* <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="城市"
        //                 >
        //                     {form.getFieldDecorator('cityIds', {
        //                         rules: [{ required: true, message: '请输入区域' }],
        //                         initialValue: values.areaId
        //                     })(
        //                         <Select mode="multiple" style={{ width: 120 }} placeholder="请输入区域" >
        //                             { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
        //                         </Select>
        //                     )}
        //                 </FormItem> */}
        //                 {/* <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="设备"
        //                 >
        //                     {form.getFieldDecorator('devices', {
        //                         rules: [{ required: true, message: '请输入设备' }],
        //                         initialValue: []
        //                     })(
        //                         <Select
        //                             mode="multiple"
        //                             style={{ width: '100%' }}
        //                             placeholder="请选择设备"
        //                         >
        //                             {deviceChildren}
        //                         </Select>
        //                     )}
        //                 </FormItem>
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="楼层"
        //                 >
        //                     {form.getFieldDecorator('floor', {
        //                         rules: [{ required: true, message: '请输入设备' }],
        //                         initialValue: ''
        //                     })(
        //                         <Input placeholder="请输入设备" />
        //                     )}
        //                 </FormItem>
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="大小"
        //                 >
        //                     {form.getFieldDecorator('capacity', {
        //                         rules: [{ required: true, message: '请输入容量' }],
        //                         initialValue: values.capacity
        //                     })(
        //                         <Input placeholder="请输入容量" />
        //                     )}
        //                 </FormItem>
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="会议室类型"
        //                 >
        //                     {form.getFieldDecorator('roomType', {
        //                         rules: [{ required: true, message: '请输入类型' }],
        //                         initialValue: values.roomType
        //                     })(
        //                         <Select style={{ width: 120 }} placeholder="请输入类型">
        //                             { roomTypes.map((item) => (<Option key={item.RoomType} value={item.RoomType}>{item.name}</Option>)) }
        //                         </Select>
        //                     )}
        //                 </FormItem>
        //                 {values.roomType === 2 && <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="预留给"
        //                 >
        //                     {form.getFieldDecorator('onlyForUsers', {
        //                         rules: [{ required: false, message: '请输入类型' }],
        //                         initialValue: []
        //                     })(
        //                         <Select style={{ width: 120 }} placeholder="请输入类型" >
        //                         </Select>
        //                     )}
        //                 </FormItem>}
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="所属部门"
        //                 >
        //                     {form.getFieldDecorator('departmentId', {
        //                         rules: [{ required: false, message: '请输入部门' }],
        //                         initialValue: values.departmentId
        //                     })(
        //                         <Select style={{ width: 120 }} placeholder="请输入部门" >
        //                             { departments.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
        //                         </Select>
        //                     )}
        //                 </FormItem>
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="设备码"
        //                 >
        //                     {form.getFieldDecorator('deviceCode', {
        //                         rules: [{ required: true, message: '请输入设备码' }],
        //                         initialValue: values.deviceCode
        //                     })(
        //                         <Input placeholder="请输入设备码" />
        //                     )}
        //                 </FormItem>
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="可预订"
        //                 >
        //                     {form.getFieldDecorator('isEnable', {
        //                         rules: [{ required: true, message: '请输入' }],
        //                         initialValue: values.isEnable,
        //                         valuePropName: 'checked'
        //                     })(
        //                         <Checkbox></Checkbox>
        //                     )}
        //                 </FormItem> */}
        //             </CreateModal>
        //         );
        //     });
        // case 'festival':
        //     return Form.create()((props) => {
        //         const { modalVisible, form, handleModalVisible, values, isEdit } = props;
        //         const okHandle = (before, after) => {
        //             before && before();
        //             form.validateFields((err, fieldsValue) => {
        //                 if (err) return;
        //                 if(values.id) {
        //                     fieldsValue.id = values.id;
        //                 }
        //                 fetch.post(`${'/api/festival/toggleFestival'}?token=${localStorage.getItem('__meeting_token')}`, {
        //                     ...fieldsValue
        //                 }).then(() => {
        //                     handleModalVisible(false);
        //                     after && after();
        //                     onCreated();
        //                 }).catch(() => {
        //                     message.error('修改失败')
        //                     handleModalVisible(false);
        //                 });
        //             });
        //         };
        //         return (
        //             <CreateModal
        //                 title={ isEdit ? '编辑品牌' : '新建品牌'}
        //                 visible={modalVisible}
        //                 onOk={okHandle}
        //                 okText="确认"
        //                 cancelText="取消"
        //                 onCancel={() => handleModalVisible(false)}
        //             >
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="日期"
        //                 >
        //                     {form.getFieldDecorator('theDate', {
        //                         rules: [{ required: true, message: '"请输入品牌名称' }],
        //                         initialValue: values.theDate
        //                     })(
        //                         <DatePicker placeholder="请输入日期" />
        //                     )}
        //                 </FormItem>
        //                 <FormItem
        //                     labelCol={{ span: 5 }}
        //                     wrapperCol={{ span: 15 }}
        //                     label="描述"
        //                 >
        //                     {form.getFieldDecorator('description', {
        //                         rules: [{ required: false, message: '请输入描述' }],
        //                         initialValue: values.description || ''
        //                     })(
        //                         <Input placeholder="请输入描述" />
        //                     )}
        //                 </FormItem>
        //             </CreateModal>
        //         );
        //     });
    }
}