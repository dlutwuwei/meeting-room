import React, { Component } from 'react'
import { Form, Input, Button, Breadcrumb, message } from 'antd';
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
        fetch.get('/api/systemSetting/getSetting', {
            token: localStorage.getItem('__meeting_token')
        }).then((r) => {
            this.props.form.setFieldsValue(r.data);
        }).catch(() => {
            message.error('获取设置失败 ');
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
                message.success('保存设置成功');
            }).catch(() => {
                message.error('保存设置失败');
            });
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                    <Breadcrumb.Item>系统集成</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="login-form" style={{width: 500, marginTop: 30}}>
                    <FormItem {...formItemLayout} label="exchange协议">
                        {getFieldDecorator('o365Address', {
                            initialValue: '',
                            rules: [{ required: true, message: 'Please input protocol!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="AD链接">
                        {getFieldDecorator('adAddress', {
                            rules: [{ required: true, message: 'Please input server ip!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="账号">
                        {getFieldDecorator('oUserName', {
                            rules: [{ required: true, message: 'Please input your account name!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码">
                        {getFieldDecorator('oPassword', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {getFieldDecorator('description', {
                            rules: [{ required: false, message: 'Please input your description!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        {/*<Button type="primary" htmlType="submit" style={{marginRight: 10}}>链接</Button>*/}
                        <Button type="primary" htmlType="button" onClick={this.handleSubmit}>保存</Button>
                    </FormItem>
                </Form>
            </div>
                )
            }
        }
        
export default Form.create()(Exchange)