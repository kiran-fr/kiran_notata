import React from "react";
import "./text-box.scss";

export default function TextBox({ placeholder, onChange, maxWidth }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={maxWidth ? "max-text-box text-box" : "text-box"}
      onChange={onChange}
    ></input>
  );
}
