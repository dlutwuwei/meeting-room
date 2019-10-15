import { Button, Modal, Form, Input, Radio } from 'antd';
import React from "react";
import './edit.less';

const EditForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="预定信息修改"
          okText="保存"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="horizontal">
            <Form.Item label="会议主题">
              {getFieldDecorator('subject', {
                rules: [{ required: true, message: '输入会议主题' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark')(<Input type="textarea" />)}
            </Form.Item>
            <div className="info-container">
              <div className="left">
                <Form.Item label="品牌">
                  {getFieldDecorator('brandName', {
                    rules: [{ required: false, message: '' }],
                  })(<Input disabled/>)}
                </Form.Item>
                <Form.Item label="部门">
                  {getFieldDecorator('divisionName', {
                    rules: [{ required: false, message: '' }],
                  })(<Input disabled/>)}
                </Form.Item>
                <Form.Item label="容量">
                  {getFieldDecorator('people', {
                    rules: [{ required: false, message: '' }],
                  })(<Input disabled/>)}
                </Form.Item>
              </div>
              <div className="right">
                <Form.Item label="部门">
                  {getFieldDecorator('divisionName', {
                    rules: [{ required: false, message: '' }],
                  })(<Input disabled/>)}
                </Form.Item>
                <Form.Item label="培训室名称">
                  {getFieldDecorator('roomName', {
                    rules: [{ required: false, message: '' }],
                  })(<Input disabled/>)}
                </Form.Item>
                <Form.Item label="价格">
                  {getFieldDecorator('price', {
                    rules: [{ required: false, message: '' }],
                  })(<Input disabled/>)}
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      );
    }
  },
);

export default EditForm