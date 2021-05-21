import React, { useState, useEffect } from "react";
import styles from "./SortByPopup.module.css";

export default function SortByPopup({ title, items, isOpen, setIsOpen }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div>
          <div className={styles.popup}>
            <div className={styles.popup_title}>
              {title}
              <i
                onClick={close}
                style={{ marginLeft: "5px" }}
                className="fas fa-chevron-up"
              ></i>
            </div>
            <div className={styles.menu_items}>
              {items.map((name, i) => {
                return <div onClick={() => setOpen(false)}>{name}</div>;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
