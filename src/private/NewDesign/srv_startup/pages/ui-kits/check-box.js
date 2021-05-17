import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./check-box.scss";

export default function InputCheckBox({
  checked,
  onChange,
  label,
  name,
  ...props
}) {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} name={name} onChange={onChange} />}
      label={label}
    />
    // <Checkbox checked={checked} name="checkbox" {...props}></Checkbox>
  );
}
