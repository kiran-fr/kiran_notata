import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import "./check-box.scss";

export default function InputCheckBox({ checked }) {
  return (
    <Checkbox checked={checked} onChange={null} name="checkbox"></Checkbox>
  );
}
