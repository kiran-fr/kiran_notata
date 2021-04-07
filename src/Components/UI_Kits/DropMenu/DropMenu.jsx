import React  from 'react';
import Card from "@material-ui/core/Card";
import './style.css';
import {IconButton} from './Component/IconButton'

const DropMenu = () => {
  return (
    <Card className="drop-menu-card">
      <IconButton title="Request Startup" iconName="fa fa-briefcase"/>
      <IconButton title="Archive Startup" iconName="fa fa-briefcase"/>
      <IconButton title="Remove Startup" iconName="fa fa-briefcase"/>
    </Card>
  )

}

export default DropMenu;