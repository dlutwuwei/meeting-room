import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Modal, Divider, List, Card, Form, Row, Col, Badge, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import fetch from 'lib/fetch';
import StandardTable from 'components/standard-table';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const styles = {};
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
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
    componentWillReceiveProps(nextProps) {
        const { match } = nextProps;
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
    handleAdd = (fields) => {
        this.props.dispatch({
            type: 'rule/add',
            payload: {
                description: fields.desc,
            },
        });

        message.success('添加成功');
        this.setState({
            modalVisible: false,
        });
    }
    render() {
        const { list: data, selectedRows, loading, modalVisible } = this.state;

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: 5,
            total: 50,
        };
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
            <div className={styles.listContent}>
                <div className={styles.listContentItem}>
                    <span>Owner</span>
                    <p>{owner}</p>
                </div>
                <div className={styles.listContentItem}>
                    <span>开始时间</span>
                    <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
                </div>
                <div className={styles.listContentItem}>
                    <Progress statusMap={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
                </div>
            </div>
        );

        return (
            <div className="">
                <Card
                    className={styles.listCard}
                    bordered={false}
                    title="用户管理"
                    style={{ marginTop: 24 }}
                    bodyStyle={{ padding: '0 32px 40px 32px' }}
                >
                    <Button type="primary" style={{ marginTop: 8 }} icon="plus" onClick={() => this.handleModalVisible(true)}>添加</Button>
                    <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={data}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                    />
                </Card>
                <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                />
            </div>
        );
    }
}
