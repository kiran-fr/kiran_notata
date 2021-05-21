import React, { useState } from "react";

import styles from "../Kanban.module.css";

import DropDown from "../../../../assets/images/DropDown.svg";
import Sort from "../../../../assets/images/sort.svg";

import SortByPopup from "./SortByPopup";

export default function BoardHeader({ children, icon }) {
  const [popup, setPopup] = useState(false);

  return (
    <div className={styles.boardHead}>
      <img src={icon} alt="Bar Icon"></img>
      <h2 className={styles.boardHeader}>{children}</h2>
      <span className={styles.boardHeadSortBy}>
        <SortByPopup
          title="Sort By"
          items={["Starred", "Alphabet", "Numerical", "Something"]}
          isOpen={popup}
          setIsOpen={setPopup}
        ></SortByPopup>
        <span onClick={() => setPopup(!popup)}>
          Sort By<img src={DropDown} alt="Drop Down Icon"></img>
        </span>
        <span>
          <img src={Sort} alt="Sort"></img>
        </span>
      </span>
    </div>
  );
}
