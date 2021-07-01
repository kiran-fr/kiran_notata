import React from "react";

// API
import { useQuery } from "@apollo/client";
import { connectionPagesGet } from "private/Apollo/Queries";

//STYLES
import styles from "./Paginator.module.css";

export default function Paginator({ currentPage, setCurrentPage }) {
  const { data, loading } = useQuery(connectionPagesGet);

  // Loader
  if (loading) {
    return <span />;
  }

  const currentPageNo = (currentPage && currentPage.pageNo) || 1;

  // Data
  let pages = data?.connectionPagesGet || [];

  return (
    <div className={styles.container}>
      <span>PAGE</span>
      <i
        className={`fa fa-chevron-left ${styles.leftArrow}`}
        onClick={() => {
          let prevPage = pages.find(
            ({ pageNo }) => pageNo === currentPageNo - 1
          );
          setCurrentPage(prevPage);
        }}
      />
      <input
        type="text"
        autoComplete="off"
        className={styles.paginatorInput}
        value={currentPageNo}
        onFocus={e => e.target.select()}
        onChange={e => {
          let val = e.target.value;
          let selectedPage = pages.find(
            ({ pageNo }) => pageNo === parseInt(val)
          );
          if (selectedPage) {
            setCurrentPage(selectedPage);
          }
        }}
      />

      <span> of </span>
      <span style={{ marginLeft: "10px" }}>{pages.length + 1}</span>
      <i
        className={`fa fa-chevron-right ${styles.rightArrow}`}
        onClick={() => {
          let nextPage = pages.find(
            ({ pageNo }) => pageNo === currentPageNo + 1
          );
          nextPage && setCurrentPage(nextPage);
        }}
      />
    </div>
  );
}
