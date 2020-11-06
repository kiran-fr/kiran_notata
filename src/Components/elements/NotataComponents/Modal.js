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

export const Modal = ({
  close,
  noKill,
  submit,
  title,
  disableFoot,
  loading,
  showScrollBar,
  ...children
}) => {
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
        style={{ overflow: showScrollBar ? "hidden" : "auto" }}
        className={content}
        onClick={event => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className={inner}>
          {title && (
            <div className={modal_header}>
              {title && <div className={modal_title}>{title}</div>}

              {!noKill && (
                <div onClick={close} className={close_modal}>
                  <i className="fal fa-times" />
                </div>
              )}
            </div>
          )}

          <div
            style={{
              overflowY: showScrollBar ? "scroll" : "none",
              maxHeight: showScrollBar ? "60vh" : "auto",
            }}
            className={`${showScrollBar && "scrollbar"} ${main_content}`}
            {...children}
          />

          {(close || submit) && !disableFoot && (
            <div className={modal_footer}>
              {close && (
                <Button onClick={close} size="medium" buttonStyle="secondary">
                  Cancel
                </Button>
              )}

              {submit && (
                <Button
                  onClick={!loading && submit}
                  size="medium"
                  type="right_arrow"
                  loading={loading}
                >
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
