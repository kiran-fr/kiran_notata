import React from "react";
import classnames from "classnames";

import {
  button_container,
  chevron_icon,
  loading_icon,
  icon_padding,
  large_button,
  medium_button,
  small_button,
  tiny_right_button_container,
  secondary_style,
  input_button_wrapper,
  input_button_icon
} from "./Button.module.css";

const StandardButton = ({
  type,
  buttonStyle,
  size,
  loading,
  onClick,
  ...children
}) => {
  onClick = onClick || console.log("click");

  let withIconPadding = loading || type === "right_arrow";

  const sizeClass =
    (size && size === "large" && large_button) ||
    (size && size === "medium" && medium_button) ||
    (size && size === "small" && small_button) ||
    (!size && large_button);

  return (
    <button
      className={classnames(
        button_container,
        sizeClass,
        withIconPadding && icon_padding,
        buttonStyle && buttonStyle === "secondary" && secondary_style
      )}
      onClick={onClick}
    >
      <div {...children} />

      {type === "right_arrow" && !loading && (
        <span className={chevron_icon}>
          <i className="fal fa-chevron-right" />
        </span>
      )}

      {loading && (
        <span className={loading_icon}>
          <i className="fa fa-spinner fa-spin" />
        </span>
      )}
    </button>
  );
};

const InputButton = ({ value, size, loading }) => {
  const sizeClass =
    (size && size === "large" && large_button) ||
    (size && size === "medium" && medium_button) ||
    (size && size === "small" && small_button) ||
    (!size && medium_button);

  return (
    <div className={input_button_wrapper}>
      <input
        type="submit"
        className={classnames(button_container, icon_padding, sizeClass)}
        value={value}
      />

      <div className={classnames(input_button_icon, sizeClass)}>
        {!loading && (
          <span className={chevron_icon}>
            <i className="fal fa-chevron-right" />
          </span>
        )}

        {loading && (
          <span className={loading_icon}>
            <i className="fa fa-spinner fa-spin" />
          </span>
        )}
      </div>
    </div>
  );
};

const TinyRightButton = ({ type, onClick, ...children }) => {
  onClick =
    onClick ||
    function() {
      console.log("click");
    };
  return (
    <button
      className={classnames(tiny_right_button_container)}
      onClick={onClick}
    >
      <i className="fal fa-chevron-right" />
    </button>
  );
};

export const Button = props => {
  let { type } = props;

  if (type === "tiny_right") {
    return <TinyRightButton {...props} />;
  }

  if (type === "input") {
    return <InputButton {...props} />;
  }

  return <StandardButton {...props} />;
};
