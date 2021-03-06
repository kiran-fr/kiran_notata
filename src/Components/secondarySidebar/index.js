import React from "react";
import styles from "./sidebar.module.scss";

export default function SecondarySidebar({ children, title, icon, close }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarToggler}>
        <i className="fas fa-chevron-right" onClick={() => close(false)}></i>
        <span className={styles.padLeft}>{title}</span>
      </div>
      {/* <div className={styles.title}>
        <i className={icon}></i> 
      </div> */}
      <div className={styles.sidebarMain}>{children}</div>
    </div>
  );
}
