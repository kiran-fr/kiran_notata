import React from "react";

import { frontpage } from "definitions.js";
import { History } from "history";

// STYLE
import styles from "./Header.module.css";

const classnames = require("classnames");

export const Header = ({ history }: { history: History }) => {
  return (
    <div className={styles.dashboard_header_container}>
      <div className={classnames(styles.header_block_logo, "desktop_only")}>
        <div className={styles.logo} onClick={() => history.push(frontpage)}>
          NOTATA
        </div>
      </div>
    </div>
  );
};
