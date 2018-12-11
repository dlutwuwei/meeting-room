import React, { Component } from 'react'
import { Form, Input, Button, Breadcrumb, message, Radio, Select } from 'antd';
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
        officeInterfaceType: ''
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
            this.setState({
                officeInterfaceType: r.data.officeInterfaceType
            });
            this.props.form.setFieldsValue(r.data);
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
            }).then(() => {
                message.success( __('保存设置成功'));
            }).catch(() => {
                message.error( __('保存设置失败'));
            });
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
        const mgRequired = officeInterfaceType === 'Microsoft Graph';
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
                <div style={{ display: officeInterfaceType === 'Microsoft Graph' ? 'block': 'none'}}>
                    <FormItem {...formItemLayout} label={ __('通知邮箱')}>
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
                                })
                            }}>
                                <Option value="EWS">EWS</Option>
                                <Option value="MicrosoftGraph">Microsoft Graph</Option>
                            </Select>
                        )}
                    </FormItem>
                    {list}
                    <FormItem {...tailFormItemLayout}>
                        {/*<Button type="primary" htmlType="submit" style={{marginRight: 10}}>链接</Button>*/}
                        <Button type="primary" htmlType="button" onClick={this.handleSubmit}>{__('保存')}</Button>
                    </FormItem>
                </Form>
            </div>
                )
            }
        }
        
export default Form.create()(Exchange)