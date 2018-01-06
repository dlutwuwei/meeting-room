import { Select } from 'antd';
import React, { Component } from 'react';
import './select.less';

class MySelect extends Component {
    render () {
        return (
            <Select className="my-select" {...this.props} />
        )
    }
}

export default MySelect;
