import React, { Component } from 'react';
import { Form, Modal, Button, AutoComplete, message } from 'antd';
import fetch from 'lib/fetch';
const Option = AutoComplete.Option;

const FormItem = Form.Item;

class CreateModal extends Component {
    state = {
        loading: false
    }
    render () {
        const { visible, title, onOk, okText, cancelText, onCancel } = this.props;
        const { loading } = this.state;
        return (
            <Modal
                title={title}
                onCancel={() => {
                    this.setState({
                        loading: false
                    });
                    onCancel()
                }}
                visible={visible}
                footer={[
                    <Button key="back" onClick={onCancel}>{cancelText}</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={() => {
                        onOk(() => {
                            this.setState({
                                loading: true
                            });
                        }, () => {
                            this.setState({
                                loading: false
                            });
                        })
                    }}>
                        {okText}
                    </Button>,
                ]}
            >
                {this.props.children}
            </Modal>
        )
    }
}

class SearchUser extends Component {
    state = {
        list: [],
        dataSource: []
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
                dataSource: r.data.list.map(item => ({
                    id: item.id,
                    name: item.userName,
                    mail: item.mail
                })),
                fetching: false
            });
        });
    }
    okHandle = (before, after) => {
        const {form, handleModalVisible } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            before && before();
            fetch.post('/api/whitelist/add', {
                token: localStorage.getItem('__meeting_token'),
                ...fieldsValue
            }).then(() => {
                after && after();
                handleModalVisible(false);
                SearchUser.created();
            }).catch(() => {
                handleModalVisible(false);
                message.error('添加失败');
            });
        });
    };
    onSelect = () => {
        // todo
    }
    render () {
        const { modalVisible, form, handleModalVisible } = this.props;
        const { dataSource } = this.state;
        const children = dataSource.map((item, i) => {
            return <Option value={'' + item.id} key={i}>{item.name}</Option>;
          });
        return (
            <CreateModal
                title="新建名单"
                visible={modalVisible}
                onOk={this.okHandle}
                okText="确定"
                cancelText="取消"
                onCancel={() => handleModalVisible()}
            >
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="用户"
                >
                    {form.getFieldDecorator('userId', {
                        rules: [{ required: true, message: '"请输入名称' }],
                    })(
                        <AutoComplete
                            dataSource={dataSource}
                            style={{ width: 200 }}
                            onSelect={this.onSelect}
                            onSearch={this.handleSearch}
                            placeholder="输入用户名"
                        >
                            {children}
                        </AutoComplete>
                    )}
                </FormItem>
            </CreateModal>
        );
    }
}

export default (_, created) => {
    SearchUser.created = created;
    return Form.create()(SearchUser);
}