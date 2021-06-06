import React, { useState, useEffect, useRef } from "react";
import styles from "./SortByPopup.module.css";

export default function SortByPopup({ items, isOpen, setIsOpen }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const close = () => {
    setOpen(false);
  };

  const handleName = name => {
    setOpen(false);
    setIsOpen(name);
  };

  const popup = useRef();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalEvent = e =>
      !e.path.includes(popup.current) && open && isOpen ? close() : null;

    window.addEventListener("click", handleGlobalEvent);

    return () => {
      window.removeEventListener("click", handleGlobalEvent);
    };
  });

  return (
    <>
      {open && (
        <div ref={popup}>
          <div className={styles.popup}>
            <div className={styles.menu_items}>
              {items.map((name, i) => {
                return <div onClick={() => handleName(name)}>{name}</div>;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
