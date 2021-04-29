import React, { useState } from "react";
import styles from "./modal.module.css";
import AddTag from "./addTag";

export default function DealFLowTag({ value, title, children }) {
  const [open, setOpen] = useState(value);
  const handleModal = val => {
    setOpen(!open);
  };
  if (!open) return <div></div>;
  return (
    <div className={styles.tableModal}>
      <div className={styles.tableModalOutter}>
        <div className={styles.tableModalInner}>
          <div className={styles.close} onClick={() => handleModal()}>
            <i className="fal fa-times"></i>
          </div>
          <div className={styles.top}>
            <h1>{title}</h1>
          </div>
          <div className={styles.main}>
            <AddTag />
          </div>
          <div className={styles.footer}>
            <div className={styles.buttonContainer}>
              <button onClick={() => handleModal()}>CANCEL</button>
              <button>
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
