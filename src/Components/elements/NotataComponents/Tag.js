import React from "react";
import classnames from "classnames";

import { container, content, active_tag, button_tag } from "./Tag.module.css";

export const Tag = ({ className, active, isButton, onClick, ...children }) => {
  return (
    <div
      className={classnames(
        container,
        active && active_tag,
        isButton && button_tag,
        className && className
      )}
      onClick={onClick}
    >
      <div className={content} {...children} />
    </div>
  );
};
