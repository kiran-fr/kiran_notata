import React from "react";
import styles from "./modal.module.css";

export default function DealFLowTag({
  saveModal,
  closeModal,
  title,
  children,
  width,
  load,
  disabled,
}) {
  const handleModal = () => {
    closeModal(false);
  };

  const handleSave = () => {
    saveModal();
  };

  const nonClickable = disabled ? true : false;
  return (
    <div className={styles.tableModal}>
      <div className={styles.tableModalOutter}>
        <div className={styles.tableModalInner} style={{ width: width }}>
          <div className={styles.close} onClick={() => handleModal()}>
            <i className="fal fa-times" />
          </div>
          <div className={styles.top}>
            <h1>{title}</h1>
          </div>
          <div className={styles.main}>{children}</div>
          <div className={styles.footer}>
            <div className={styles.buttonContainer}>
              <button onClick={() => handleModal()}>CANCEL</button>
              <button disabled={nonClickable} onClick={() => handleSave()}>
                {" "}
                {load ? (
                  <i className={"fa fa-spinner fa-spin"} />
                ) : (
                  <>
                    <i className="far fa-check"></i>
                    SAVE
                  </>
                )}
              </button>
              <button onClick={handleModal}>CLOSE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
