import React, { useState } from "react";

// Components
import SortByPopup from "./SortByPopup";

// Styles
import styles from "../Kanban.module.css";

// Images
import DropDown from "../../../../../assets/images/DropDown.svg";
import Sort from "../../../../../assets/images/sort.svg";

export default function BoardHeader({
  children,
  icon,
  filters,
  setFilter,
  index,
}) {
  // States
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState("");

  // Functions
  const handleName = name => {
    setName(name);
  };

  const handlePopup = () => {
    setPopup(!popup);
  };

  const handleSorting = index => {
    console.log("sortingvalue");
    if (name === "Company Name") {
      let sortBy = "ALPHA";
      let sortDirection =
        filters.sortBy === "ALPHA" && filters.sortDirection !== "DESC"
          ? "DESC"
          : "ASC";
      setFilter({
        sortBy,
        sortDirection,
        indexNumber: index,
      });
    } else {
      let sortBy = "STARRED";
      let sortDirection =
        filters.sortBy === "STARRED" && filters.sortDirection !== "DESC"
          ? "DESC"
          : "ASC";
      setFilter({
        sortBy,
        sortDirection,
        indexNumber: index,
      });
    }
  };

  // JSX
  return (
    <div className={styles.boardHead}>
      <img src={icon} alt="Bar Icon"></img>
      <h2 className={styles.boardHeader}>{children}</h2>
      <span className={styles.boardHeadSortBy}>
        <SortByPopup
          items={["Starred", "Company Name"]}
          isOpen={popup}
          setIsOpen={handleName}
        ></SortByPopup>
        <span onClick={() => handlePopup()}>
          Sort By<img src={DropDown} alt="Drop Down Icon"></img>
        </span>
        <span onClick={() => handleSorting(index)}>
          <img src={Sort} alt="Sort"></img>
        </span>
      </span>
    </div>
  );
}
