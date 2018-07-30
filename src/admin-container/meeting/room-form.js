import React, { Component } from 'react'
import { Form, Input, Select, Checkbox, Spin, message, Icon, Upload } from 'antd';
import fetch from 'lib/fetch';

const FormItem = Form.Item;
const Option = Select.Option;

const deviceChildren = [];
deviceChildren.push(<Option key={'hasTV'}>电视</Option>);
deviceChildren.push(<Option key={'hasPhone'}>电话</Option>);
deviceChildren.push(<Option key={'hasWhiteBoard'}>白板</Option>);
deviceChildren.push(<Option key={'hasProjector'}>投影仪</Option>);

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/png';
    if (!isJPG) {
        message.error('You can only upload PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
        message.error('Image must smaller than 5MB!');
    }
    return isJPG && isLt2M;
}

class Room extends Component {
    state = {
        showOnlyUsers:  this.props.values.roomType === 2 || this.props.values.roomType === 3,
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
    handleChange = (type, info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
          }
          if (info.file.status === 'done') {
            const image = info.file.response.data;
            if(type === 'free') {
                this.setState({
                    loading1: false,
                    imageUrl1: image
                })
            } else {
              this.setState({
                  loading2: false,
                  imageUrl2: image
              });
            }
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, () => this.setState({
              // [type === 'free' ? 'imageUrl1' : 'imageUrl2' ]: imageUrl,
              loading: false,
            }));
          }
    }
    render () {
        const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
        const roomTypes = JSON.parse(localStorage.getItem('__meeting_type') || '[]');
        const departments = JSON.parse(localStorage.getItem('__meeting_department') || '[]');
        
        const { form, values } = this.props;
        const devices = [];
        Object.keys(values).forEach(item => {
            if(['hasTV', 'hasPhone', 'hasWhiteBoard', 'hasProjector'].includes(item) && values[item]) {
                devices.push(item);
            }
        });

        const { loading1, loading2, imageUrl1 = values.bgForFree, imageUrl2 = values.bgForBusy } = this.state;
        const uploadButton1 = (
            <div>
                <Icon type={loading1 ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const uploadButton2 = (
            <div>
                <Icon type={loading2 ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('会议室名称')}
                >
                    {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: __('请输入会议室名称') }],
                        initialValue: values.name
                    })(
                        <Input placeholder={__('请输入会议室名称')} />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__("邮箱")}
                >
                    {form.getFieldDecorator('mail', {
                        rules: [{ required: true, message: __('请输入邮箱') }],
                        initialValue: values.mail
                    })(
                        <Input placeholder={__('请输入邮箱')} />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__("所属区域")}
                >
                    {form.getFieldDecorator('areaId', {
                        rules: [{ required: true, message: __('请输入区域') }],
                        initialValue: values.areaId
                    })(
                        <Select style={{ width: 120 }} placeholder={__("请输入区域")} >
                            { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__("设备")}
                >
                    {form.getFieldDecorator('devices', {
                        rules: [{ required: false, message: __('请选择设备') }],
                        initialValue: devices
                    })(
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder={__('请选择设备')}
                        >
                            {deviceChildren}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('楼层')}
                >
                    {form.getFieldDecorator('floor', {
                        rules: [{ required: true, message: __('请输入楼层') }],
                        initialValue: values.floor
                    })(
                        <Input placeholder={__('请输入楼层')} />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('大小')}
                >
                    {form.getFieldDecorator('capacity', {
                        rules: [{ required: true, message: __('请输入容量') }],
                        initialValue: values.capacity
                    })(
                        <Input placeholder={__("请输入容量")} />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('会议室类型')}
                >
                    {form.getFieldDecorator('roomType', {
                        rules: [{ required: true, message: '请输入类型' }],
                        initialValue: values.roomType
                    })(
                        <Select style={{ width: 120 }} placeholder={__('请输入类型')} onChange={(val) => {
                            this.setState({
                                showOnlyUsers: val === 2 || val === 3
                            });
                        }}>
                            { roomTypes.map((item) => (<Option key={item.RoomType} value={item.RoomType}>{item.name}</Option>)) }
                        </Select>
                    )}
                </FormItem>
                {this.state.showOnlyUsers && <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('预留给')}
                >
                    {form.getFieldDecorator('onlyForUsers', {
                        initialValue: values.onlyForUsers ? values.onlyForUsers.split(',') : [],
                        rules: [{
                            type: 'array',
                            required: false,
                            message: '请输入预留用户',
                        }]
                    })(
                        <Select
                            style={{ width: '100%' }}
                            mode={__('multiple')}
                            placeholder={__('请输入预留用户')}
                            notFoundContent={this.state.fetching ? <Spin size='small' /> : null}
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
                    label={__('所属部门')}
                >
                    {form.getFieldDecorator('departmentId', {
                        rules: [{ required: false, message: '请输入部门' }],
                        initialValue: values.departmentId
                    })(
                        <Select style={{ width: 120 }} placeholder={__('请输入部门')} >
                            { departments.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('设备码')}
                >
                    {form.getFieldDecorator('deviceCode', {
                        rules: [{ required: false, message: '请输入设备码' }],
                        initialValue: values.deviceCode
                    })(
                        <Input placeholder={__('请输入设备码')} />
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('可预订')}
                >
                    {form.getFieldDecorator('isEnable', {
                        rules: [{ required: false, message: '请输入' }],
                        initialValue: values.isEnable,
                        valuePropName: 'checked'
                    })(
                        <Checkbox></Checkbox>
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('会议室空闲时')}
                >
                    {form.getFieldDecorator('bgForFree', {
                        rules: [{ required: false, message: '请输入' }],
                        initialValue: values.bgForFree,
                    })(
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={`/api/meetingRoomSetting/uploadbg?token=${localStorage.getItem('__meeting_token')}`}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange.bind(this, 'free')}
                            >
                            {(imageUrl1 && imageUrl1 !== 'null') ? <img src={imageUrl1} alt="" /> : uploadButton1}
                        </Upload>
                    )}
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={__('会议室忙碌时')}
                >
                    {form.getFieldDecorator('bgForBusy', {
                        rules: [{ required: false, message: '请输入' }],
                        initialValue: values.bgForBusy,
                    })(
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={`/api/meetingRoomSetting/uploadbg?token=${localStorage.getItem('__meeting_token')}`}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange.bind(this, 'busy')}
                            >
                            {(imageUrl2 && imageUrl2 !== 'null') ? <img src={imageUrl2} alt="" /> : uploadButton2}
                        </Upload>
                    )}
                </FormItem>
            </div>
        );
    }
}

export default Room