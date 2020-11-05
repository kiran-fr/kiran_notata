import React from "react";

import styles from "./Content.module.css";

interface Props {
  maxWidth?: number;
  center?: boolean;
  children?: any;
}
const classnames = require('classnames');

export const Content = ({ maxWidth, center, ...children }: Props) => {
  return (
    <div
      className={classnames(styles.container, center && styles.center_content)}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      <div className={styles.content} {...children} />
    </div>
  );
};
