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
  onClick,
  loading,
}) {
  return (
    <Button
      startIcon={
        // <i className="fa fa-spinner fa-spin" />
        ICONPOSITION.START === iconPosition ? (
          loading ? (
            <i className="fa fa-spinner fa-spin" />
          ) : (
            <Icon> {iconName} </Icon>
          )
        ) : null
      }
      endIcon={
        ICONPOSITION.END === iconPosition ? <Icon> {iconName} </Icon> : null
      }
      className={`${className} button-container`}
      onClick={onClick}
    >
      {" "}
      {text} {/*{*/}
      {/*  !loading*/}
      {/*    ? <i className="fa fa-spinner fa-spin" />*/}
      {/*    : <span>{" "}{text}{" "}</span>*/}
      {/*}*/}
    </Button>
  );
}
