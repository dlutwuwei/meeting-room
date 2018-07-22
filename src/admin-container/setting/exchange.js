import React, { Component } from 'react'
import { Form, Input, Button, Breadcrumb, message, Select } from 'antd';
import fetch from 'lib/fetch';

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
    componentDidMount () {
        this.fetchExchangeSetting();
    }
    fetchExchangeSetting (areaId = 0) {
        fetch.get('/api/systemSetting/getSetting', {
            token: localStorage.getItem('__meeting_token'),
            areaId
        }).then((r) => {
            if(r.data.areaId === 0) {
                r.data.areaId = areaId;
            }
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
    handleArea = (areaId) => {
        this.fetchExchangeSetting(areaId)
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const areas = JSON.parse(localStorage.getItem('__meeting_areas') || '[]');

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
                            initialValue: ''
                        })(
                            <Select style={{ width: 120 }} placeholder={__("请选择区域")} onChange={this.handleArea}>
                                { areas.map((item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)) }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={__("exchange协议")}>
                        {getFieldDecorator('o365Address', {
                            initialValue: '',
                            rules: [{ required: true, message: 'Please input protocol!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={__("AD链接")}>
                        {getFieldDecorator('adAddress', {
                            rules: [{ required: true, message: 'Please input server ip!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('账号')}>
                        {getFieldDecorator('oUserName', {
                            rules: [{ required: true, message: 'Please input your account name!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('密码')}>
                        {getFieldDecorator('oPassword', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={ __('描述')}>
                        {getFieldDecorator('description', {
                            rules: [{ required: false, message: 'Please input your description!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
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