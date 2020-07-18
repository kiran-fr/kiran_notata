import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import {
  container,
  progress_container,
  progress_inner,
  no_decoration,
  label_class,
  sub_label_class
} from "./BigButton.module.css";
import { noselect } from "./GeneralStyle.module.css";

export default ({
  label,
  subLabel,
  className,
  onClick,
  progress,
  history,
  link
}) => {
  if (link) {
    return (
      <Link to={link} className={no_decoration}>
        <div className={classnames(container, noselect, className)}>
          {(subLabel && (
            <div>
              <div className={label_class}>{label}</div>
              <div className={sub_label_class}>{subLabel}</div>
            </div>
          )) ||
            label}
          {progress !== undefined && (
            <div className={progress_container}>
              <div
                className={progress_inner}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div
      className={classnames(container, noselect, className)}
      onClick={onClick}
    >
      {(subLabel && (
        <div>
          <div className={label_class}>{label}</div>
          <div className={sub_label_class}>{subLabel}</div>
        </div>
      )) ||
        label}

      {progress !== undefined && (
        <div className={progress_container}>
          <div className={progress_inner} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};
