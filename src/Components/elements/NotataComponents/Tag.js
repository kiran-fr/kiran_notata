import React from "react";
import classnames from "classnames";

import { container, content } from "./Tag.module.css";

export const Tag = ({ ...children }) => {
  return (
    <div className={classnames(container)}>
      <div className={content} {...children} />
    </div>
  );
};
