import React, { Component } from 'react'

class List extends Component {
    render () {
        const type = this.props.match.params.type;
        return (
            <div>
                List content: {type}
            </div>
        )
    }
}

export default List