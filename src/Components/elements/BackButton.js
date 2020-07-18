import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { backButton, backButtonInner } from "./BackButton.module.css";
import { color3_bg_h } from "./Colors.module.css";

export default ({ link, history, onClick, label }) => {
  if (onClick) {
    return (
      <div className={backButton} onClick={onClick}>
        <div className={classnames(backButtonInner, color3_bg_h)}>
          {label || "Go back"}
        </div>
      </div>
    );
  }

  if (link) {
    return (
      <Link to={link}>
        <div className={backButton}>
          <div className={classnames(backButtonInner, color3_bg_h)}>
            {label || "Go back"}
          </div>
        </div>
      </Link>
    );
  }

  if (history) {
    return (
      <div className={backButton} onClick={() => history.goBack()}>
        <div className={classnames(backButtonInner, color3_bg_h)}>Go back</div>
      </div>
    );
  }
};
