import React from "react";
import Button from "@material-ui/core/Button";
import { ICONPOSITION } from "../constants";
import Icon from "@material-ui/core/Icon";
import "./button-with-icon.scss";

export default function ButtonWithIcon({
  iconName,
  className,
  text,
  iconPosition,
}) {
  return (
    <Button
      startIcon={
        ICONPOSITION.START === iconPosition ? <Icon> {iconName} </Icon> : null
      }
      endIcon={
        ICONPOSITION.END === iconPosition ? <Icon> {iconName} </Icon> : null
      }
      className={`${className} button-container`}
    >
      {" "}
      {text}{" "}
    </Button>
  );
}
