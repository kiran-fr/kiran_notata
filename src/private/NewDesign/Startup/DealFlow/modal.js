import React, { Children, useState } from "react";
import styles from "./modal.module.css";
import AddTag from "./addTag";
import AddGroup from "./addGroup";
import AddFunnel from "./addFunnel";

export default function DealFLowTag({
  saveModal,
  closeModal,
  title,
  children,
  width,
}) {
  const handleModal = () => {
    closeModal(false);
  };
  const handleSave = () => {
    saveModal();
  };
  return (
    <div className={styles.tableModal}>
      <div className={styles.tableModalOutter}>
        <div className={styles.tableModalInner} style={{ width: width }}>
          <div className={styles.close} onClick={() => handleModal()}>
            <i className="fal fa-times"></i>
          </div>
          <div className={styles.top}>
            <h1>{title}</h1>
          </div>
          <div className={styles.main}>{children}</div>
          <div className={styles.footer}>
            <div className={styles.buttonContainer}>
              <button onClick={() => handleModal()}>CANCEL</button>
              <button onClick={() => handleSave()}>
                {" "}
                <i className="far fa-check"></i> SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}