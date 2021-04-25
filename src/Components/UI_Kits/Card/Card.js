import React from "react";
import classnames from "classnames";
import styles from "./style.css";

export function Card({
  maxWidth,
  noMargin,
  label,
  style,
  className,
  ...children
}) {
  return (
    <div
      className={classnames(
        styles.container,
        noMargin && styles.no_margin,
        className && className
      )}
      style={{
        ...style,
        maxWidth: maxWidth ? maxWidth : "auto",
      }}
    >
      {label && <div className={styles.card_label}>{label}</div>}
      <div className={styles.content} {...children} />
    </div>
  );
}
