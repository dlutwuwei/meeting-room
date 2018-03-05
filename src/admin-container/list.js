import React, { PureComponent } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import StandardTable from 'components/standard-table';

export default class BasicList extends PureComponent {
    state = {
        selectedRows: [],
        loading: false,
        modalVisible: false,
        record: {},
        isEdit: false
    }
    componentDidMount() {
        this.props.fetchData();
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.type !== nextProps.type) {
            this.setState({
                loading: true
            });
            this.props.fetchData(() => {
                this.setState({
                    loading: false
                });
            });
        }

    }
    handleSelectRows = () => {

    }
    handleStandardTableChange = () => {

    }
    handleModalVisible = (flag) => {
        this.setState({
            isEdit: false,
            record: {},
            modalVisible: !!flag,
        });
    }
    render() {
        const { selectedRows, loading, modalVisible, record, isEdit } = this.state;
        const { data, breadcrumb, getColumns, page, pageSize, createForm, showAdd } = this.props;
        const CreateForm = createForm;
        const parentMethods = {
            handleModalVisible: this.handleModalVisible.bind(this),
        };
        const columns = getColumns((index) => {
            // 打开编辑框的方法, 传递给编辑按钮
            this.setState({
                modalVisible: true,
                isEdit: true,
                record: data[index]
            });
        });
        return (
            <div className="list-container">
                {breadcrumb}
                <div className="list-main">
                    { showAdd && <Button type="primary" className="add-button" icon="plus" onClick={() => this.handleModalVisible(true)}>添加</Button>}
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
                    values={record}
                    isEdit={isEdit}
                    modalVisible={modalVisible}
                />}
            </div>
        );
    }
}

BasicList.defaultProps = {
    showAdd: true
};
