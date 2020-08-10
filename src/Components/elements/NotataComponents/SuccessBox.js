import React from "react";
import classnames from "classnames";

import { container, content, title_style } from "./SuccessBox.module.css";

export const SuccessBox = ({ className, title, style, ...children }) => {
  return (
    <div
      className={classnames(container, className && className)}
      style={style}
    >
      {title && <div className={title_style}>{title}</div>}
      <div className={content} {...children} />
    </div>
  );
};
