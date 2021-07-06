import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./check-box.scss";

export default function InputCheckBox({
  checked,
  onChange,
  label,
  name,
  value,
  defaultChecked,
  register,
  ...props
}) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          defaultChecked={defaultChecked}
          value={value}
          name={name}
          onChange={onChange}
          register={register}
        />
      }
      label={label}
      {...props}
    />
    // <Checkbox checked={checked} name="checkbox" {...props}></Checkbox>
  );
}
