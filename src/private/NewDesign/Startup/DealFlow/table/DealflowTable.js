import React, { useEffect, useState } from "react";
import styles from "./table.module.css";
import { startup_page } from "definitions";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";
import SelectAllPopup from "./SelectAllPopup";

import ArchiveModal from "./modals/ArchiveModal";
import AddToGroupModal from "./modals/AddToGroupModal";
import AddTagsModal from "./modals/AddTagsModal";
import {
  Loader
} from "Components/UI_Kits";

export default function Table(props) {
  const { data, loading, emptyLabel, history, updateFunnelTag } = props;

  const [preview, setPreview] = useState();

  const [checked, setChecked] = useState({});
  const [checkAll, setCheckAll] = useState(false);

  const [viewModal, setViewModal] = useState(undefined);

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
      <i className="fas fa-plus-circle" />
    </button>
  );

  const handleCompany = connection => {
    history.push(`${startup_page}/company/${connection.id}`);
  };

  const popupItems = [
    {
      title: "Archive",
      nested: [],
    },
    {
      title: "Add To Group",
      nested: [],
      // nested: ["Group 1", "Group 2"],
    },
    {
      title: "Add Tags",
      nested: [],
      // nested: ["Tag 1", "Tag 2"],
    },
  ];

  return (
    <>
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
              checkAll={checkAll}
              setCheckAll={setCheckAll}
            />
            <TableBody
              {...props}
              handleCompany={handleCompany}
              ButtonGreen={ButtonGreen}
              showPreview={showPreview}
              preview={preview}
              hidePreview={hidePreview}
              updateFunnelTag={updateFunnelTag}
              checkAll={checkAll}
              checked={checked}
              setChecked={setChecked}
            />
          </table>

          <SelectAllPopup
            items={popupItems}
            isOpen={popup}
            setIsOpen={setPopup}
            setSelect={item => {
              setViewModal(item.title);
            }}
          />

          {!data.length && loading && (
            <Loader size = "medium"/>
          )}

          {!data.length && (
            <div className={styles.empty_list}>
              {emptyLabel || "This list is empty"}
            </div>
          )}
        </div>
      </div>

      {viewModal === "Archive" && (
        <ArchiveModal
          ids={checkAll ? data.map(({ id }) => id) : Object.keys(checked)}
          close={() => {
            setCheckAll(false);
            setChecked({});
            setViewModal(undefined);
          }}
        />
      )}

      {viewModal === "Add To Group" && (
        <AddToGroupModal
          connections={data.filter(connection =>
            checkAll ? true : !!checked[connection.id]
          )}
          close={() => {
            setCheckAll(false);
            setChecked({});
            setViewModal(undefined);
          }}
        />
      )}

      {viewModal === "Add Tags" && (
        <AddTagsModal
          ids={checkAll ? data.map(({ id }) => id) : Object.keys(checked)}
          close={() => setViewModal(undefined)}
        />
      )}
    </>
  );
}
