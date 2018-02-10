import React, { PureComponent, Fragment } from 'react';
import { Modal, Divider, Form, Input, Button, Icon, message, Breadcrumb} from 'antd';
import fetch from 'lib/fetch';
import StandardTable from 'components/standard-table';

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
    },
    {
        title: '邮箱',
        dataIndex: 'mail',
    },
    {
        title: '联系方式',
        dataIndex: 'contact'
    },
    {
        title: '部门',
        dataIndex: 'departmentName'
    },
    {
        title: '地区',
        dataIndex: 'cityName'
    },
    {
        title: '操作',
        render: () => (
            <Fragment>
                <a href=""><Icon type="form" /></a>
                <Divider type="vertical" />
                <a href=""><Icon type="delete" /></a>
            </Fragment>
        ),
    },
];
const FormItem = Form.Item;

const CreateForm = Form.create()((props) => {
    const { modalVisible, form, handleAdd, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            title="新建规则"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="描述"
            >
                {form.getFieldDecorator('desc', {
                    rules: [{ required: true, message: 'Please input some description...' }],
                })(
                    <Input placeholder="请输入" />
                    )}
            </FormItem>
        </Modal>
    );
});

export default class BasicList extends PureComponent {
    state = {
        list: [],
        selectedRows: [],
        loading: false,
        modalVisible: false
    }
    componentDidMount() {
    }
    fetchUsers = () => {
        fetch.get('/api/user/getList', {
            token: localStorage.getItem('__meeting_token')
        }).then(res => {
            this.setState({
                list: res.data
            });
        });
    }
    componentWillReceiveProps() {
        this.fetchUsers();
    }
    handleSelectRows = () => {

    }
    handleStandardTableChange = () => {

    }
    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }
    handleAdd = () => {

        message.success('添加成功');
        this.setState({
            modalVisible: false,
        });
    }
    render() {
        const { list: data, selectedRows, loading, modalVisible } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        return (
            <div className="list-container">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>会议室管理</Breadcrumb.Item>
                    <Breadcrumb.Item>区域管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="list-main">
                    <Button type="primary" className="add-button" icon="plus" onClick={() => this.handleModalVisible(true)}>添加</Button>
                    <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={data}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                    />
                </div>
                <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                />
            </div>
        );
    }
}
