import React, { PureComponent } from 'react';
import { Modal, Form, Input, Button, message} from 'antd';
import StandardTable from 'components/standard-table';

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
        const { data, breadcrumb, columns, page, pageSize, createForm } = this.props;
        const CreateForm = createForm;
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible.bind(this),
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
                { createForm && <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                />}
            </div>
        );
    }
}
