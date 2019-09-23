import { Button, Modal, Form, Input, Radio } from 'antd';
import React from "react";

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
            {/* <Form.Item label="备注">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </Form.Item> */}
          </Form>
        </Modal>
      );
    }
  },
);

export default EditForm