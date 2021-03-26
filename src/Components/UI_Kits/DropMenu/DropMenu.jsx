import React  from 'react';
import './style.css';
import {IconButton} from './Component/IconButton'

const DropMenu = () => {
    return (
        <div className="drop-menu-div">
            <IconButton title="Request Startup" iconName="fa fa-briefcase"/>
            <IconButton title="Archive Startup" iconName="fa fa-briefcase"/>
            <IconButton title="Remove Startup" iconName="fa fa-briefcase"/>
        </div>
    )

}

export default DropMenu;