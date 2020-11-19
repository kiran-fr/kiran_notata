import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Activity.module.css";

import { Log } from "./Log";

const classnames = require("classnames");

const Activity = ({ user, group }: any) => {
  const [visibleMobile, setVisibleMobile] = useState(false);

  const ref = useRef(null);
  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (!(ref.current! as any).contains(e.target)) setVisibleMobile(false);
    },
    [ref.current]
  );

  useEffect(() => {
    document.addEventListener("mousedown", clickListener);
    return () => {
      document.removeEventListener("mousedown", clickListener);
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={classnames(
          styles.sidebar_container,
          visibleMobile
            ? styles.open_mobile_container
            : styles.closed_mobile_container
        )}
      >
        <Log user={user} group={group} />
      </div>
      <div
        className={classnames(styles.icons, "mobile_only")}
        onClick={() => setVisibleMobile(!visibleMobile)}
      >
        <i className="far fa-comment"></i>
      </div>
    </>
  );
};

export default Activity;
