import React, { useState, useEffect, useRef } from "react";
import styles from "./PopupMenu.module.css";

import KanbanIcon from "../../../assets/images/KanbanIcon.svg";

export default function PopupMenu({
  title,
  items,
  isOpen,
  setIsOpen,
  setSelectedfunnelGroup,
}) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setIsOpen(false);
    setOpen(false);
  };

  const handleSelected = (name, index) => {
    setSelectedfunnelGroup(index);
  };

  const popup = useRef();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalEvent = e =>
      !e?.path?.includes(popup?.current) && open && isOpen ? close() : null;

    window.addEventListener("click", handleGlobalEvent);

    return () => {
      window.removeEventListener("click", handleGlobalEvent);
    };
  });

  return (
    <>
      {open && (
        <div>
          <div className={styles.popup} ref={popup}>
            <div className={styles.popup_title}>
              <img
                src={KanbanIcon}
                alt=""
                style={{
                  transform: "rotateZ(360deg)",
                  width: "12px",
                  height: "12px",
                }}
              />
              {title}
              <i
                onClick={close}
                style={{ marginLeft: "5px", color: "#53cab2" }}
                className="fas fa-chevron-up"
              ></i>
            </div>
            <div className={styles.menu_items}>
              {items.map((name, index) => {
                return (
                  <div key={index} onClick={() => handleSelected(name, index)}>
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
