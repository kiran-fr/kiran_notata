import React from "react";
import classnames from "classnames";

import { container, content } from "./Content.module.css";

export const Content = ({ maxWidth, ...children }) => {
  return (
    <div
      className={classnames(container)}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      <div className={content} {...children} />
    </div>
  );
};
