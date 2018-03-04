import React, { Component } from 'react'
import { Breadcrumb, Icon, Divider, Modal, Form, Radio, Input, Button } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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

class RoomList extends Component {
    handleSubmit = () => {

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>系统设置</Breadcrumb.Item>
                    <Breadcrumb.Item>会议室设置</Breadcrumb.Item>
                </Breadcrumb>
                <Form onSubmit={this.handleSubmit} className="login-form" style={{marginTop: 30 }}>
                    <FormItem {...formItemLayout} label="会议室预定最长不超过">
                        {getFieldDecorator('maxMeetingHour', {
                            rules: [{ required: true, message: 'Please input protocol!' }],
                        })(
                            <Input style={{width: 100, margin: '0 10px 0 0'}} />
                        )}
                        小时
                        {getFieldDecorator('maxMeetingMinutes', {
                            rules: [{ required: true, message: 'Please input protocol!' }],
                        })(
                            <Input style={{width: 100, margin: '0 10px'}} />
                        )}
                        分钟
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否可循环预定">
                        {getFieldDecorator('isReccurent', {
                            rules: [{ required: true, message: 'Please input server ip!' }],
                        })(
                            <RadioGroup>
                                <Radio value="true">是</Radio>
                                <Radio value="false">否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="最大预定天数">
                        {getFieldDecorator('maxBookingDays', {
                            rules: [{ required: true, message: 'Please input your account name!' }],
                        })(
                            <Input style={{width: 100, marginRight: '10px'}}/>
                        )}天
                    </FormItem>
                    <FormItem {...formItemLayout} label="会议签到时间">
                        {getFieldDecorator('maxCheckInTime', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input style={{width: 100, marginRight: '10px'}}/>
                        )}分钟
                    </FormItem>
                    <FormItem {...formItemLayout} label="超过签到时间自动释放">
                        {getFieldDecorator('autoRelease', {
                            rules: [{ required: true, message: 'Please input your description!' }],
                        })(
                            <RadioGroup>
                                <Radio value="true">是</Radio>
                                <Radio value="false">否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="报故邮箱">
                        {getFieldDecorator('noticeMail', {
                            rules: [{ required: true, message: 'Please input your description!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="回复消息">
                        {getFieldDecorator('responseMessage', {
                            rules: [{ required: true, message: 'Please input your description!' }],
                        })(
                            <Input.TextArea />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="会议室展板背景图片（空闲）">
                        <RadioGroup>
                            <Radio value="true">默认背景</Radio>
                            <Radio value="false">自定义背景</Radio>
                        </RadioGroup>
                        {getFieldDecorator('bgForFree', {
                            rules: [{ required: true, message: 'Please input your description!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="会议室展板背景图片（会议）">
                        <RadioGroup>
                            <Radio value="true">默认背景</Radio>
                            <Radio value="false">自定义背景</Radio>
                        </RadioGroup>
                        {getFieldDecorator('bgForBusy', {
                            rules: [{ required: true, message: 'Please input your description!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(RoomList);