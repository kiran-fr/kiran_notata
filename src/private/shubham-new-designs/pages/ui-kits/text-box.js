import React from "react";
import "./text-box.scss";

export default function TextBox({ placeholder }) {
  return (
    <input type="text" placeholder={placeholder} className="text-box"></input>
  );
}
