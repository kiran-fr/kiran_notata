import React from "react";
import "./CardMessageContainer.scss";

export default function CardMessageContainer({
  danger,
  success,
  notice,
  title,
  message,
  children,
}) {
  return (
    <div className={`card-message`}>
      <div
        className={`card-message__content ${
          (danger && "danger") ||
          (success && "success") ||
          (notice && "notice") ||
          "regular"
        }`}
      >
        <span className="material-icons icon">
          {(notice && "info") ||
            (danger && "error_outline") ||
            (success && "check_circle") ||
            "warning_amber"}
        </span>

        {title && <div className="card-message__content__title">{title}</div>}
        {message && (
          <div className="card-message__content__message">{message}</div>
        )}
        <div className="card-message__content__children">{children}</div>
      </div>
    </div>
  );
}
