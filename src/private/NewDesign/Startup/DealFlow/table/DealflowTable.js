import React, { useState } from "react";
import styles from "./table.module.css";
import { startup_page } from "definitions";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";

import SelectAllPopup from "./SelectAllPopup";

export default function Table(props) {
  const { data, loading, emptyLabel, history, updateFunnelTag } = props;

  const [preview, setPreview] = useState();

  const [popup, setPopup] = useState(false);

  const showPreview = no => {
    setPreview(no);
  };

  const handlePopup = () => {
    console.log("Changing Popup State: ", popup);
    setPopup(!popup);
  };

  const hidePreview = ({ no }) => {
    setPreview(null);
  };

  const ButtonGreen = () => (
    <button className={styles.buttongreen}>
      <i className="fas fa-plus-circle"></i>
    </button>
  );

  const handleCompany = connection => {
    history.push(`${startup_page}/company/${connection.id}`);
    // `${startup_page}/${connection.id}`);
  };

  const popupItems = [
    {
      title: "Delete From Dealflow",
      nested: [],
    },
    {
      title: "Add To Group",
      nested: ["Group 1", "Group 2"],
    },
    {
      title: "Add Tags",
      nested: ["Tag 1", "Tag 2"],
    },
  ];

  return (
    <div className={styles.tableOuterWrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.startupTable}>
          <TableHeader
            {...props}
            handleCompany={handleCompany}
            ButtonGreen={ButtonGreen}
            showPreview={showPreview}
            preview={preview}
            hidePreview={hidePreview}
            handlePopup={handlePopup}
          />
          <TableBody
            {...props}
            handleCompany={handleCompany}
            ButtonGreen={ButtonGreen}
            showPreview={showPreview}
            preview={preview}
            hidePreview={hidePreview}
            updateFunnelTag={updateFunnelTag}
          />
        </table>
        <SelectAllPopup
          items={popupItems}
          isOpen={popup}
          setIsOpen={setPopup}
        ></SelectAllPopup>
        {!data.length && loading && (
          <div className={styles.loader}>
            <i className={"fa fa-spinner fa-spin"} />
          </div>
        )}
        {!data.length && (
          <div className={styles.empty_list}>
            {emptyLabel || "This list is empty"}
          </div>
        )}
      </div>
    </div>
  );
}
