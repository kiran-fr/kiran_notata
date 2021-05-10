import React from "react";
import "./radio-button.css";

export default function RadioButton({ name, label, id, checked }) {
  return (
    <label class="radio-button-container">
      <span className="radio-button-label">{label}</span>
      <input type="radio" id={id} checked={checked} name={name} />
      <span class="checkmark"></span>
    </label>
  );
}
