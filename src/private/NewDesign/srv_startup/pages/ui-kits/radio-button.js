import React from "react";
import "./radio-button.css";

export default function RadioButton({
  name,
  label,
  value,
  id,
  checked,
  defaultChecked,
  defaultValue,
  ...props
}) {
  return (
    <label class="radio-button-container">
      <span className="radio-button-label">{label}</span>
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        name={name}
        {...props}
      />
      <span class="checkmark"></span>
    </label>
  );
}
