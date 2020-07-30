import React from "react";
import classnames from "classnames";

import { container, content, no_margin } from "./Card.module.css";

export const Card = ({ maxWidth, noMargin, ...children }) => {
  return (
    <div
      className={classnames(container, noMargin && no_margin)}
      style={{ maxWidth: maxWidth ? maxWidth : "auto" }}
    >
      <div className={content} {...children} />
    </div>
  );
};
