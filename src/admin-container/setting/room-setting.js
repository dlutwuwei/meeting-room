import React, { Component } from 'react'
import { Checkbox, Breadcrumb, Icon, Form, Radio, Input, Button, message, Row, Col, Upload, Spin } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import fetch from 'lib/fetch';

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
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

class RoomSettings extends Component {
    state = {
        loading1: false,
        loading2: false,
        loading: false,
        imageUrl1: '',
        imageUrl2: '',
        selectBusy: false,
        selectFree: false,
        responseMsg: false,
        areas: [],
    }
    componentDidMount() {
        this.setState({
            loading: true
        });
        fetch.get('/api/area/getList', {
            token: localStorage.getItem('__meeting_token')
        }).then(r => {
            this.setState({
                areas: r.data.list.map(item => ({
                    shortCode: item.shortCode,
                    name: item.name,
                    id: item.id
                })),
                selectArea: r.data.list[0].id,
                loading: false
            });
            this.props.form.setFieldsValue({
                area: r.data.list[0].shortCode
            });
            fetch.get('/api/meetingRoomSetting/getSetting?', {
                token: localStorage.getItem('__meeting_token'),
                areaId: r.data.list[0].id
            }).then(r => {
                this.setState({
                    imageUrl1: r.data.bgForFree,
                    imageUrl2: r.data.bgForBusy,
                    selectFree: r.data.isDefaultBgForFree,
                    selectBusy: r.data.isDefaultBgForBusy,
                    responseMsg: r.data.responseMessage,
                    loading: false
                });
                delete r.data.bgForBusy;
                delete r.data.bgForFree;
                this.props.form.setFieldsValue(r.data);
            }).catch(() => {
                this.setState({
                    loading: false
                });
                message.error('获取设置失败');
            })
        }).catch(() => {
            this.setState({
                loading: false
            });
            message.error('获取设置失败');
        });
    }

    handleSubmit = () => {
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { imageUrl1, imageUrl2, selectFree, selectBusy } = this.state;
            fieldsValue.isDefaultBgForFree = selectFree;
            fieldsValue.isDefaultBgForBusy = selectBusy;
            fieldsValue.bgForFree = imageUrl1;
            fieldsValue.bgForBusy = imageUrl2;
            if(!this.state.responseMsg) {
                fieldsValue.responseMessage = '';
            }
            this.setState({
                loading: true
            });
            fetch.post('/api/meetingRoomSetting/saveSetting?token=' + localStorage.getItem('__meeting_token'), {
                ...fieldsValue
            }).then(() => {
                message.success('保存设置成功');
                this.setState({
                    loading: false
                });
            }).catch(() => {
                message.error('保存设置失败');
                this.setState({
                    loading: false
                });
            });
        });

    }
    handleFreeChange = (e) => {
        this.setState({
            selectFree: e.target.value,
            // imageUrl1: e.target.value ? '' : this.state.imageUrl1
        });
    }
    handleBusyChange = (e) => {
        this.setState({
            selectBusy: e.target.value,
            // imageUrl2: e.target.value ? '' : this.state.imageUrl1
        });
    }
    handleAreaChange = (e) => {
        this.setState({
            loading: true
        });
        fetch.get('/api/meetingRoomSetting/getSetting?', {
            token: localStorage.getItem('__meeting_token'),
            areaId: e.target.value
        }).then(r => {
            this.setState({
                imageUrl1: r.data.bgForFree,
                imageUrl2: r.data.bgForBusy,
                responseMsg: r.data.responseMessage
            });
            delete r.data.bgForBusy;
            delete r.data.bgForFree;
            this.props.form.setFieldsValue(r.data);
            this.setState({
                loading: false
            });
        }).catch(() => {
            message.error('获取设置失败');
            this.setState({
                loading: false
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
    onAreaChange = (e) => {
        this.props.form.setFieldsValue({
            area: e.target.value
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { selectFree, selectBusy, imageUrl1, imageUrl2, loading1, loading2, areas, selectArea, loading} = this.state;
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
        const areasOptions = areas.map(item  => (<Radio value={item.id}>{item.name}</Radio>))
        return (
            <Spin spinning={loading}>
                <div>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                        <Breadcrumb.Item>会议室设置</Breadcrumb.Item>
                    </Breadcrumb>
                    <Form onSubmit={this.handleSubmit} className="login-form" style={{ marginTop: 30 }}>
                        <FormItem {...formItemLayout} label="区域">
                            {getFieldDecorator('areaId', {
                                rules: [{ required: false, message: '' }],
                                initialValue: selectArea
                            })(
                                <RadioGroup onChange={this.handleAreaChange}>
                                    {areasOptions}
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="会议室预定最长不超过">
                            {getFieldDecorator('maxMeetingHour', {
                                rules: [{ required: true, message: '请输入时间' }],
                            })(
                                <Input style={{ width: 100, margin: '0 10px 0 0' }} />
                            )}
                            小时
                            {getFieldDecorator('maxMeetingMinutes', {
                                rules: [{ required: true, message: '请输入时间' }],
                            })(
                                <Input style={{ width: 100, margin: '0 10px' }} />
                            )}
                            分钟
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否可循环预定">
                            {getFieldDecorator('isReccurent', {
                                rules: [{ required: true, message: '请选择是否可循环预定' }],
                            })(
                                <RadioGroup>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="最大预定天数">
                            {getFieldDecorator('maxBookingDays', {
                                rules: [{ required: true, message: '请输入天数' }],
                            })(
                                <Input style={{ width: 100, marginRight: '10px' }} />
                            )}天
                        </FormItem>
                        <FormItem {...formItemLayout} label="会议签到时间">
                            {getFieldDecorator('maxCheckInTime', {
                                rules: [{ required: true, message: '请输入时间' }],
                            })(
                                <Input style={{ width: 100, marginRight: '10px' }} />
                            )}分钟
                        </FormItem>
                        <FormItem {...formItemLayout} label="超过签到时间自动释放">
                            {getFieldDecorator('autoRelease', {
                                rules: [{ required: true, message: '请选择是否自动释放' }],
                            })(
                                <RadioGroup>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="报故邮箱">
                            {getFieldDecorator('noticeMail', {
                                rules: [{ required: true, message: '多个邮箱请用；隔开' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="回复消息">
                            <Checkbox onChange={(e) => {
                                this.setState({
                                    responseMsg: e.target.checked
                                });
                            }} checked={this.state.responseMsg}>回复会议请求时自动添加以下文本</Checkbox>
                            {getFieldDecorator('responseMessage', {
                                rules: [{ required: false, message: '请写入消息' }],
                            })(
                                <Input.TextArea placeholder="" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="会议室展板背景图片">
                            <Row>
                                <Col span={10} className="left">
                                    <div>1. 空闲状态</div>
                                    <RadioGroup onChange={this.handleFreeChange} value={selectFree}>
                                        <Radio value={true}>默认背景</Radio>
                                        <Radio value={false}>自定义背景</Radio>
                                    </RadioGroup>
                                    { !selectFree && 
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action={`/api/meetingRoomSetting/uploadbg?token=${localStorage.getItem('__meeting_token')}`}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleChange.bind(this, 'free')}
                                        >
                                            {imageUrl1 ? <img src={imageUrl1} alt="" /> : uploadButton1}
                                        </Upload>
                                    }
                                </Col>
                                <Col span={3} />
                                <Col span={10} className="right">
                                    <div>2. 会议状态</div>
                                    <RadioGroup onChange={this.handleBusyChange} value={selectBusy}>
                                        <Radio value={true}>默认背景</Radio>
                                        <Radio value={false}>自定义背景</Radio>
                                    </RadioGroup>
                                    { !selectBusy &&
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action={`/api/meetingRoomSetting/uploadbg?token=${localStorage.getItem('__meeting_token')}`}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleChange.bind(this, 'busy')}
                                        >
                                            {imageUrl2 ? <img src={imageUrl2} alt="" /> : uploadButton2}
                                        </Upload>
                                    }
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                        </FormItem>
                    </Form>
                </div>
            </Spin>
            )
    }
}

export default Form.create()(RoomSettings);