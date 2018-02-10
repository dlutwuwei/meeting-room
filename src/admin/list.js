import React, { PureComponent } from 'react';
import { Modal, Form, Input, Button, message} from 'antd';
import StandardTable from 'components/standard-table';

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
        selectedRows: [],
        loading: false,
        modalVisible: false
    }
    componentDidMount() {
        this.props.fetchData();
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.type !== nextProps.type) {
            this.props.fetchData();
        }

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
        const { selectedRows, loading, modalVisible } = this.state;
        const { data, breadcrumb, columns, page, pageSize } = this.props;
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        return (
            <div className="list-container">
                {breadcrumb}
                <div className="list-main">
                    <Button type="primary" className="add-button" icon="plus" onClick={() => this.handleModalVisible(true)}>添加</Button>
                    <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={{
                            list: data,
                            pagination: {
                                page,
                                pageSize
                            }
                        }}
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
