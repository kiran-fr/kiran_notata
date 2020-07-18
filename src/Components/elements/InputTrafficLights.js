import React from "react";
import classnames from "classnames";
import { color1_bg, color1, white } from "./Colors.module.css";
import {
  gridItem,
  notSelected,
  traffic_lights,
  traffic_red,
  traffic_yellow,
  traffic_green
} from "./Grid.module.css";
import { noselect } from "./GeneralStyle.module.css";

class InputTrafficLights extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { active, onClick, color } = this.props;
    return (
      <div className={traffic_lights}>
        <div
          className={classnames(
            gridItem,
            noselect,
            color === "red" && traffic_red,
            color === "yellow" && traffic_yellow,
            color === "green" && traffic_green,
            active
              ? classnames(color1_bg, white)
              : classnames(notSelected, color1)
          )}
          onClick={onClick}
        />
      </div>
    );
  }
}

export default InputTrafficLights;
