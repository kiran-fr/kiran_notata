import React from "react";
import classnames from "classnames";

import { container, content, center_content } from "./Content.module.css";

export const Content = ({ maxWidth, center, ...children }) => {
  return (
    <div
      className={classnames(container, center && center_content)}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      <div className={content} {...children} />
    </div>
  );
};
