import React from "react";
import classnames from "classnames";

import { container, content, no_margin, card_label } from "./Card.module.css";

export const Card = ({ maxWidth, noMargin, label, style, ...children }) => {
  return (
    <div
      className={classnames(container, noMargin && no_margin)}
      style={{
        ...style,
        maxWidth: maxWidth ? maxWidth : "auto",
      }}
    >
      {label && <div className={card_label}>{label}</div>}
      <div className={content} {...children} />
    </div>
  );
};
