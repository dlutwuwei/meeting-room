import { Button } from 'antd';
import React, { Component } from 'react';

import './button.less';

export default function(props) {
    return <Button className="my-button" {...props} />
}