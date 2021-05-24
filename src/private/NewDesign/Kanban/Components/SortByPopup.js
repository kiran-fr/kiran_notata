import React, { useState, useEffect } from "react";
import styles from "./SortByPopup.module.css";

export default function SortByPopup({ items, isOpen, setIsOpen }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <>
      {open && (
        <div>
          <div className={styles.popup}>
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
