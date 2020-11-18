import React from "react";
import styles from "./Activity.module.css";

import { Log } from "./Log";

const classnames = require("classnames");

const Activity = ({ user, group }: any) => {
  return (
    <>
      <div className={classnames(styles.sidebar_container, "desktop_only")}>
        <Log user={user} group={group} />
      </div>
      <div className={classnames(styles.icons, "mobile_only")}>
        <i className="far fa-comment"></i>
      </div>
    </>
  );
};

export default Activity;
