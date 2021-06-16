import React, { useState, useEffect, useRef } from "react";

// Styles
import styles from "./SortByPopup.module.css";

export default function SortByPopup({ items, isOpen, setIsOpen }) {
  // Constants
  const popup = useRef();

  // States
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // Functions
  const close = () => {
    setOpen(false);
  };

  const handleName = name => {
    setOpen(false);
    setIsOpen(name);
  };

  // Effects
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
                return (
                  <div key={`id-${i}`} onClick={() => handleName(name)}>
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
