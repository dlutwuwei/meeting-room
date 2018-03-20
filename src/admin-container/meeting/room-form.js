import React, { Component } from 'react'
import { Form, Input, Select, Checkbox, Spin } from 'antd';
import fetch from 'lib/fetch';

const FormItem = Form.Item;
const Option = Select.Option;

const deviceChildren = [];
deviceChildren.push(<Option key={'hasTv'}>电视</Option>);
deviceChildren.push(<Option key={'hasPhone'}>电话</Option>);
deviceChildren.push(<Option key={'hasWhiteBoard'}>白板</Option>);
deviceChildren.push(<Option key={'hasProjector'}>投影仪</Option>);

class Room extends Component {
    state = {
        showOnlyUsers:  this.props.values.roomType === 2,
        dataSource: [],
        fetching: false,
    }
    handleRecevierSelect = (val) => {
        const userList = (this.props.values.onlyForUsers || '').split(',');
        const user = this.state.dataSource.find(item => item.mail == val);
        if(user) {
          userList.push(user);
        }
        this.props.form.setFieldsValue({
            onlyForUsers: userList.map(item => item.mail)
        });
    }
    handelDeselect = (val) => {
        let userList = this.props.form.getFieldValue('onlyForUsers');
        const index = userList.findIndex(item => item.mail === val);
        userList = userList.slice();
        userList.splice(index, 1);
        this.props.form.setFieldsValue({
            receivers: userList.map(item => item.mail)
        });
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
            dataSource: [{
              mail: value,
              id: '',
              name: value
            }].concat(r.data.list.map(item => ({
              name: item.name,
              id: item.userId,
              mail: item.mail
            }))),
            fetching: false
          });
        });
      }
    render () {
        const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
        const roomTypes = JSON.parse(localStorage.getItem('__meeting_type') || '[]');
        const departments = JSON.parse(localStorage.getItem('__meeting_department') || '[]');
        
        const { form, values } = this.props;
        const devices = [];
        Object.keys(values).forEach(item => {
            if(['hasTv', 'hasPhone', 'hasWhiteBoard', 'hasProjector'].includes(item)) {
                devices.push(item);
            }
        });

        return (
            <div>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="会议室名称"
                >
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入会议室名称' }],
                        initialValue: values.name
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
                        initialValue: values.mail
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
                    label="设备"
                >
                    {form.getFieldDecorator('devices', {
                        rules: [{ required: true, message: '请输入设备' }],
                        initialValue: devices
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
                        initialValue: values.floor
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
                        rules: [{ required: true, message: '请输入容量' }],
                        initialValue: values.capacity
                    })(
                        <Input placeholder="请输入容量" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="会议室类型"
                >
                    {form.getFieldDecorator('roomType', {
                        rules: [{ required: true, message: '请输入类型' }],
                        initialValue: values.roomType
                    })(
                        <Select style={{ width: 120 }} placeholder="请输入类型" onChange={(val) => {
                            this.setState({
                                showOnlyUsers: val === 2
                            });
                        }}>
                            { roomTypes.map((item) => (<Option key={item.RoomType} value={item.RoomType}>{item.name}</Option>)) }
                        </Select>
                    )}
                </FormItem>
                {this.state.showOnlyUsers && <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="预留给"
                >
                    {form.getFieldDecorator('onlyForUsers', {
                        initialValue: (values.onlyForUsers || '').split(','),
                        rules: [{
                            type: 'array',
                            required: false,
                            message: '请输入预留用户',
                        }]
                    })(
                        <Select
                            style={{ width: '100%' }}
                            mode="multiple"
                            placeholder="请输入预留用户"
                            notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSelect={this.handleRecevierSelect}
                            onSearch={this.handleSearch}
                            onDeselect={this.handelDeselect}
                        >
                            {this.state.dataSource.map((item, i) => <Option key={i} value={item.mail} title={item.id}>{item.mail}</Option>)}
                        </Select>
                    )}
                </FormItem>}
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
                    label="设备码"
                >
                    {form.getFieldDecorator('deviceCode', {
                        rules: [{ required: true, message: '请输入设备码' }],
                        initialValue: values.deviceCode
                    })(
                        <Input placeholder="请输入设备码" />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="可预订"
                >
                    {form.getFieldDecorator('isEnable', {
                        rules: [{ required: true, message: '请输入' }],
                        initialValue: values.isEnable,
                        valuePropName: 'checked'
                    })(
                        <Checkbox></Checkbox>
                    )}
                </FormItem>
            </div>
        );
    }
}

export default Room