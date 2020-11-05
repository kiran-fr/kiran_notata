import React from "react";

import styles from "./Card.module.css";

interface Props {
  maxWidth?: number;
  noMargin?: boolean;
  label?: string;
  style?: {[key: string]: string}
  children?: any;
}
const classnames = require('classnames');

export const Card = ({ maxWidth, noMargin, label, style, ...children }: Props) => {
  return (
    <div
      className={classnames(styles.container, noMargin && styles.no_margin)}
      style={{
        ...style,
        maxWidth: maxWidth ? maxWidth : "auto",
      }}
    >
      {label && <div className={styles.card_label}>{label}</div>}
      <div className={styles.content} {...children} />
    </div>
  );
};
