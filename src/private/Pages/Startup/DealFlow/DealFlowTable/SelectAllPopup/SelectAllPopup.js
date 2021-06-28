import React, { useState, useEffect, useRef } from "react";

// STYLES 
import styles from "./SelectAllPopup.module.css";

export default function SelectAllPopup({ items, isOpen, setSelect }) {

  // CONST 
  const popup = useRef();

  // STATES 
  const [open, setOpen] = useState(false);

  // EFFECTS 
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalEvent = e =>
      !e.path.includes(popup.current) && open && isOpen ? setOpen(false) : null;
    window.addEventListener("click", handleGlobalEvent);
    return () => {
      window.removeEventListener("click", handleGlobalEvent);
    };
  });

  return (
    <>
      {open && (
        <div>
          <div className={styles.popup}>
            <div className={styles.menu_items}>
              {items?.map((item, i) => {
                return (
                  <>
                    <div
                      onClick={() => {
                        setSelect(item);
                        setOpen(false);
                      }}
                      className={styles.menuItem}
                    >
                      {item.title}
                    </div>
                    {/*{item.nested.length > 0 && (*/}
                    {/*  <div className={styles.nestedMenu}>*/}
                    {/*    {item.nested.map((i, _) => {*/}
                    {/*      return (*/}
                    {/*        <div className={styles.nestedMenuItem}>{i}</div>*/}
                    {/*      );*/}
                    {/*    })}*/}
                    {/*  </div>*/}
                    {/*)}*/}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
