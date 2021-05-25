import React from "react";
import "./text-box.scss";

export default function TextBox({ placeholder, maxWidth, inputval, ...props }) {
  return (
    <input
      type="text"
      defaultValue={inputval}
      placeholder={placeholder}
      className={maxWidth ? "max-text-box text-box" : "text-box"}
      {...props}
    ></input>
  );
}
