import React from "react";
import classnames from "classnames";

import {
  big_button_container,
  big_button_chevron_icon,
  tiny_right_button_container
} from "./Button.module.css";

const RightArrowButton = ({ type, ...children }) => (
  <button className={classnames(big_button_container)}>
    <div {...children} />
    <span className={big_button_chevron_icon}>
      <i className="fal fa-chevron-right" />
    </span>
  </button>
);

const TinyRightButton = ({ type, ...children }) => (
  <button className={classnames(tiny_right_button_container)}>
    <i className="fal fa-chevron-right" />
  </button>
);

export const Button = props => {
  let { type } = props;

  if (type === "right_arrow") {
    return <RightArrowButton {...props} />;
  }

  if (type === "tiny_right") {
    return <TinyRightButton {...props} />;
  }
};
