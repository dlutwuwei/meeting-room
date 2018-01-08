import React, { Component } from 'react';
import { Input } from 'antd';
import './input.less';

class MyInput extends Component {
    render () {
        return (
            <Input className="my-input" {...this.props} />
        )
    }
}

MyInput.TextArea = Input.TextArea;

export default MyInput