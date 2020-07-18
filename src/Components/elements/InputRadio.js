import React from 'react';
import classnames from 'classnames';
import { color1_bg, color1, white } from "./Colors.module.css";
import { gridItem, notSelected } from './Grid.module.css';
import { noselect } from './GeneralStyle.module.css';


class InputRadio extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let { active, onClick, label } = this.props;
    return (
      <div
        className={classnames(
          gridItem,
          noselect,
          active ? classnames(color1_bg, white) : classnames(notSelected, color1)
        )}
        onClick={onClick}
      >
        {label}
      </div>
    )
  }
}


export default InputRadio;