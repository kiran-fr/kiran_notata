import React from "react";

import styles from "../Kanban.module.css";

import DropDown from "../../../../assets/images/DropDown.svg";

export default function BoardHeader({ children, icon }) {
  return (
    <div className={styles.boardHead}>
      <img src={icon} alt="Bar Icon"></img>
      <h2 className={styles.boardHeader}>{children}</h2>
      <span className={styles.boardHeadSortBy}>
        Sort By<img src={DropDown} alt="Drop Down Icon"></img>
      </span>
    </div>
  );
}
