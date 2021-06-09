import React from "react";
import "./MessageBox.scss";

export default function MessageBox({ title, message }) {
  return (
    <div className="message-box-container">
      <div className="card message-box-container__card">
        <div className="card-heading message-box-container__heading">
          {title}
        </div>
        <div className="message-box">
          <p className="message-box__description">{message}</p>
        </div>
      </div>
    </div>
  );
}
