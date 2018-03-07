import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import Exchange from './exchange';
import Blacklist from './blacklist';
import Whitelist from './whitelist';
import RoomSetting from './room-setting';

class Setting extends Component {
    render () {
        const match = this.props.match;
        return (
            <div>
                <Route path={`${match.url}/exchange`} component={Exchange}/>
                <Route path={`${match.url}/blacklist`} component={Blacklist}/>
                <Route path={`${match.url}/whitelist`} component={Whitelist}/>
                <Route path={`${match.url}/roomsetting`} component={RoomSetting}/>
            </div>
        )
    }
}

export default Setting;