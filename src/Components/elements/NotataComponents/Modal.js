import React, { useEffect } from "react";

import {
  container,
  content,
  inner,
  close_modal,
  ghost,
  main_content,
  modal_header,
  modal_title,
  modal_footer,
} from "./Modal.module.css";

import { Button } from "../";

export const Modal = ({ close, submit, title, disableFoot, ...children }) => {
  useEffect(() => {
    function downHandler({ key }) {
      key === "Escape" && close();
    }

    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [close]);

  return (
    <div className={container}>
      <div className={ghost} />

      <div
        className={content}
        onClick={event => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className={inner}>
          <div className={modal_header}>
            {title && <div className={modal_title}>{title}</div>}

            <div onClick={close} className={close_modal}>
              <i className="fal fa-times" />
            </div>
          </div>

          <div className={main_content} {...children} />

          {(close || submit) && !disableFoot && (
            <div className={modal_footer}>
              {close && (
                <Button onClick={close} size="medium" buttonStyle="secondary">
                  Canncel
                </Button>
              )}

              {submit && (
                <Button onClick={submit} size="medium" type="right_arrow">
                  OK
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
