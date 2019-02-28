import React, { Component } from 'react'
import { Form, Input, Button, Breadcrumb, message, Radio, Select, Modal } from 'antd';
import fetch from 'lib/fetch';

const RadioGroup = Radio.Group;

const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
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
class Exchange extends Component {
    state = {
        officeInterfaceType: '',
        data: {},
        visible: false,
        authrizationUrl: ''
    }
    constructor() {
        super();
        this.areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');
    }
    componentDidMount () {
        this.fetchExchangeSetting();
    }
    fetchExchangeSetting (areaId) {
        fetch.get('/api/systemSetting/getSetting', {
            token: localStorage.getItem('__meeting_token'),
            areaId: areaId || this.areas[0].id
        }).then((r) => {
            if(r.data.areaId === 0) {
                r.data.areaId = areaId;
            }
            this.props.form.setFieldsValue(r.data);
            this.setState({
                data: r.data,
                officeInterfaceType: r.data.officeInterfaceType
            });
        }).catch(() => {
            message.error(__('获取设置失败'));
        });
    }
    handleSubmit = () => {
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            fetch.post('/api/systemSetting/saveSetting?token=' + localStorage.getItem('__meeting_token'), {
                ...fieldsValue
            }).then((res) => {
                if(this.state.officeInterfaceType === 'EwsOauth') {
                    this.setState({
                        visible: true,
                        authrizationUrl: res.data.authrizationUrl
                    });
                } else {
                    message.success( __('保存设置成功'));
                }
            }).catch(() => {
                message.error( __('保存设置失败'));
            });
        });
    }
    handleOk = () => {
        window.Clipboard.copy(this.state.authrizationUrl);
        this.setState({
            visible: false
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    handleArea = (e) => {
        this.fetchExchangeSetting(e.target.value)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const areasOptions = this.areas.map(item  => (<Radio value={item.id}>{item.name}</Radio>));
        const { officeInterfaceType } = this.state;
        const ewsRequired = officeInterfaceType === 'EWS';
        const oauthRequired = officeInterfaceType === 'EwsOauth';
        const mgRequired = officeInterfaceType === 'MicrosoftGraph' || oauthRequired;

        const list = <div>
                <div style={{ display: officeInterfaceType === 'EWS' ? 'block': 'none'}}>
                    <FormItem {...formItemLayout} label={__("Office 365Url")}>
                        {getFieldDecorator('o365Address', {
                            initialValue: '',
                            rules: [{ required: ewsRequired, message: 'Please input protocol!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('账号')}>
                        {getFieldDecorator('oUserName', {
                            initialValue: '',
                            rules: [{ required: ewsRequired, message: 'Please input your account name!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('密码')}>
                        {getFieldDecorator('oPassword', {
                            initialValue: '',
                            rules: [{ required: ewsRequired, message: 'Please input your Password!' }],
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('描述')}>
                        {getFieldDecorator('description', {
                            initialValue: '',
                            rules: [{ required: false, message: 'Please input your description!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </div>
                <div style={{ display: officeInterfaceType === 'MicrosoftGraph' || officeInterfaceType === 'EwsOauth'  ? 'block': 'none'}}>
                    <FormItem {...formItemLayout} label={ __('通知邮箱')} style={{ display: officeInterfaceType === 'MicrosoftGraph'? 'block': 'none'}}>
                        {getFieldDecorator('noticeMail', {
                            initialValue: '',
                            rules: [{ required: mgRequired, message: 'Please input your notice mail!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('Client ID')}>
                        {getFieldDecorator('clientId', {
                            initialValue: '',
                            rules: [{ required: mgRequired, message: 'Please input your notice mail!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('Client Secret')}>
                        {getFieldDecorator('clientSecret', {
                            initialValue: '',
                            rules: [{ required: mgRequired, message: 'Please input your notice mail!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('Tenant ID')}>
                        {getFieldDecorator('tenantId', {
                            initialValue: '',
                            rules: [{ required: mgRequired, message: 'Please input your notice mail!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('Redirect URI')} style={{ display: officeInterfaceType === 'EwsOauth'?'block': 'none'}}>
                        {getFieldDecorator('redirectUrl', {
                            initialValue: '',
                            rules: [{ required: oauthRequired, message: 'Please input redirect uri' }],
                        })(
                            <Input disabled />
                        )}
                    </FormItem>
                </div>
            </div>

        return (
            <div>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>{__('系统设置')}</Breadcrumb.Item>
                    <Breadcrumb.Item>{__('系统集成')}</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="login-form" style={{width: 500, marginTop: 30}}>
                    <FormItem
                        {...formItemLayout}
                        label="所属区域"
                    >
                        {getFieldDecorator('areaId', {
                            rules: [{ required: true, message: __("请选择区域") }],
                            initialValue: +this.areas[0].id
                        })(
                            <RadioGroup onChange={this.handleArea}>
                                {areasOptions}
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={__("AD链接")}>
                        {getFieldDecorator('adAddress', {
                            rules: [{ required: true, message: 'Please input server ip!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Office接入类型"
                    >
                        {getFieldDecorator('officeInterfaceType', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Please input protocol!' }],
                            })(
                            <Select onSelect={(value) => {
                                this.setState({
                                    officeInterfaceType: value
                                }, () => {
                                    const data = { ...this.state.data };
                                    delete data.officeInterfaceType;
                                    this.props.form.setFieldsValue(data);
                                })
                            }}>
                                <Option value="EWS">EWS</Option>
                                <Option value="MicrosoftGraph">Microsoft Graph</Option>
                                <Option value="EwsOauth">EWS OAuth</Option>
                            </Select>
                        )}
                    </FormItem>
                    {list}
                    <FormItem {...tailFormItemLayout}>
                        {/*<Button type="primary" htmlType="submit" style={{marginRight: 10}}>链接</Button>*/}
                        <Button type="primary" htmlType="button" onClick={this.handleSubmit}>{__('保存')}</Button>
                    </FormItem>
                </Form>
                <Modal
                    title="保存成功"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="复制"
                    cancelText="取消"
                    onCancel={this.handleCancel}
                >
                    <p>请复制下面的链接使用会议管理员账号登陆进行授权</p>
                    <p style={{ wordBreak: 'break-word'}}>{this.state.authrizationUrl}</p>
                </Modal>
            </div>
                )
            }
        }
        
export default Form.create()(Exchange)