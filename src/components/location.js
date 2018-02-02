import React, { Component } from 'react'
import Input from 'components/input';
import PropTypes from 'prop-types';

class LocationRoom extends Component {
    render () {
        const room = this.props.value.map(item => item.mail).join(';');
        return (
            <Input placeholder="" value={room} disabled style={{ width: 309 }} />
        )
    }
}
LocationRoom.propTypes = {
    value: PropTypes.array.isRequired
}

export default LocationRoom